import json
from decimal import Decimal

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Sum, F, Q

from .models import (
    Event, EventCategory,
    TicketCategory, Contestant, GuestSpeaker, Payment, Ticket, VoteTransaction, AuditLog
)
from .serializers import (
    EventSerializer, EventListSerializer,
    EventCategorySerializer,
    TicketCategorySerializer, ContestantSerializer, ContestantPublicSerializer,
    PaymentSerializer, PaymentCreateSerializer,
    TicketSerializer, TicketDetailSerializer,
    VoteTransactionSerializer, AuditLogSerializer,
    LiveResultSerializer, VoteVerifySerializer,
    STKPushRequestSerializer, STKPushTicketRequestSerializer, STKPushResponseSerializer,
)
from .utils import (
    generate_ticket_code, calculate_vote_count, 
    send_telegram_message, send_ticket_email
)
from .ticket_pdf import generate_ticket_pdf
from .daraja import initiate_stk_push, process_callback


# ── Event ViewSet ────────────────────────────────────────────────────────────

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.filter(published=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'status', 'event_status', 'featured', 'city', 'country', 'voting_enabled']
    search_fields = ['title', 'description', 'venue_name', 'city']
    ordering_fields = ['start_date', 'title', 'created_at']
    ordering = ['-start_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        return EventSerializer

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        upcoming_events = self.get_queryset().filter(
            start_date__gte=timezone.now(),
        ).order_by('start_date')
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        past_events = self.get_queryset().filter(
            start_date__lt=timezone.now()
        ).order_by('-start_date')
        serializer = self.get_serializer(past_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_events = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(featured_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def voting_events(self, request):
        """Get events that have voting enabled and are in voting_open status"""
        events = self.get_queryset().filter(
            voting_enabled=True,
            event_status='voting_open',
        )
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def register_ticket(self, request, pk=None):
        """Register a free ticket for an event. Only works for free events."""
        event = self.get_object()

        # Validate event is free (has a ticket category with price 0)
        ticket_category_id = request.data.get('ticket_category')
        full_name = request.data.get('full_name')
        email = request.data.get('email')
        phone = request.data.get('phone', '')

        if not all([full_name, email]):
            return Response(
                {'error': 'full_name and email are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket_category = None
        if ticket_category_id:
            try:
                ticket_category = TicketCategory.objects.get(id=ticket_category_id, event=event)
            except TicketCategory.DoesNotExist:
                return Response(
                    {'error': 'Invalid ticket category for this event.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # For free events, generate ticket immediately
        if ticket_category and ticket_category.price > 0:
            return Response(
                {'error': 'This is a paid event. Use the payment flow instead.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate ticket code
        event_year = event.start_date.year
        ticket_code = generate_ticket_code(event.ticket_prefix, event_year)

        ticket = Ticket.objects.create(
            event=event,
            ticket_category=ticket_category,
            ticket_code=ticket_code,
            full_name=full_name,
            email=email,
            phone=phone,
        )

        # Audit log
        AuditLog.objects.create(
            action='ticket_issued',
            actor='system',
            details=json.dumps({
                'ticket_code': ticket.ticket_code,
                'full_name': full_name,
                'event': event.title,
                'type': 'free_registration',
            }),
            event=event,
        )

        serializer = TicketDetailSerializer(ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def verify_payment(self, request, pk=None):
        """Admin verifies a payment, triggers ticket/vote processing."""
        event = self.get_object()
        payment_id = request.data.get('payment_id')
        new_status = request.data.get('status', 'successful')

        if not payment_id:
            return Response(
                {'error': 'payment_id is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            payment = Payment.objects.get(id=payment_id, event=event)
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found for this event.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment.status == 'successful':
            return Response(
                {'error': 'Payment already verified.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update payment status
        payment.status = new_status
        payment.verified_by = request.user if request.user.is_authenticated else None
        payment.verified_at = timezone.now()
        payment.save()

        results = {}

        if new_status == 'successful':
            if payment.payment_type == 'ticket':
                results = self._process_ticket_payment(payment, event)
            elif payment.payment_type == 'vote':
                results = self._process_vote_payment(payment, event, request)

        # Audit log
        AuditLog.objects.create(
            action='payment_verified',
            actor=request.user.username if request.user.is_authenticated else 'admin',
            details=json.dumps({
                'payment_id': payment.id,
                'mpesa_code': payment.mpesa_code,
                'amount': str(payment.amount),
                'new_status': new_status,
                'results': results,
            }),
            event=event,
        )

        return Response({
            'payment': PaymentSerializer(payment).data,
            'processing_results': results,
        })

    @action(detail=True, methods=['get'])
    def live_results(self, request, pk=None):
        """Get live voting results based on event's result_visibility setting."""
        event = self.get_object()

        if not event.voting_enabled:
            return Response(
                {'error': 'Voting is not enabled for this event.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        visibility = event.result_visibility

        # If no public updates, return nothing
        if visibility == 'no_public':
            return Response({'message': 'Results are not available publicly at this time.'})

        contestants = Contestant.objects.filter(
            event=event, is_active=True
        ).annotate(
            vote_count_annotated=Sum(
                'vote_transactions__vote_count',
                filter=Q(vote_transactions__status='successful')
            )
        ).order_by('-vote_count_annotated')

        results = []
        for rank, c in enumerate(contestants, 1):
            count = c.vote_count_annotated or 0
            result_entry = {
                'contestant_id': c.id,
                'contestant_name': c.name,
                'contestant_number': c.contestant_number,
                'slug': c.slug,
                'photo_url': _cloudinary_url(c.photo),
            }

            if visibility in ('full_live',):
                result_entry['vote_count'] = count
                result_entry['rank'] = rank
            elif visibility == 'rankings_only':
                result_entry['vote_count'] = None
                result_entry['rank'] = rank
            elif visibility == 'hidden':
                result_entry['vote_count'] = None
                result_entry['rank'] = None

            results.append(result_entry)

        serializer = LiveResultSerializer(results, many=True)
        return Response({
            'event': event.title,
            'result_visibility': visibility,
            'is_voting_active': event.is_voting_active,
            'results': serializer.data,
        })

    @action(detail=True, methods=['get'])
    def vote_verify(self, request, pk=None):
        """Verify votes by phone number for this event."""
        event = self.get_object()
        phone = request.query_params.get('phone', '').strip()

        if not phone:
            return Response(
                {'error': 'phone query parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        votes = VoteTransaction.objects.filter(
            event=event,
            phone_number__contains=phone[-9:] if len(phone) >= 9 else phone,
        ).select_related('contestant', 'event').order_by('-created_at')

        serializer = VoteVerifySerializer(votes, many=True)
        return Response({
            'event': event.title,
            'total_transactions': votes.count(),
            'votes': serializer.data,
        })

    @action(detail=True, methods=['post'])
    def initiate_vote_payment(self, request, pk=None):
        """
        Initiate an M-Pesa STK Push for voting.
        Creates a pending Payment record and triggers STK Push to user's phone.
        """
        event = self.get_object()

        if not event.voting_enabled or not event.is_voting_active:
            return Response(
                {'error': 'Voting is not currently active for this event.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = STKPushRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data['phone_number']
        amount = serializer.validated_data['amount']
        contestant_id = serializer.validated_data['contestant_id']

        # Validate contestant exists and is active
        try:
            contestant = Contestant.objects.get(id=contestant_id, event=event, is_active=True)
        except Contestant.DoesNotExist:
            return Response(
                {'error': 'Contestant not found or not active in this event.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Calculate vote count for informational purposes
        vote_count = calculate_vote_count(amount, event.vote_price)

        # Create pending payment record
        payment = Payment.objects.create(
            event=event,
            contestant=contestant,
            phone_number=phone_number,
            amount=amount,
            status='pending',
            payment_type='vote',
        )

        # Build callback URL
        callback_url = getattr(settings, 'MPESA_CALLBACK_URL', '')
        if not callback_url:
            # Fallback: construct from request
            host = request.get_host()
            scheme = 'https' if request.is_secure() else 'http'
            callback_url = f"{scheme}://{host}/api/mpesa-callback/"

        # Initiate STK Push
        stk_result = initiate_stk_push(
            phone_number=phone_number,
            amount=float(amount),
            account_reference=f"VOTE{event.id}",
            transaction_desc=f"Vote for {contestant.name}",
            callback_url=callback_url,
        )

        # Update payment with STK details
        payment.checkout_request_id = stk_result.get('checkout_request_id') or ''
        payment.merchant_request_id = stk_result.get('merchant_request_id') or ''
        payment.stk_response = stk_result
        payment.save()

        if stk_result.get('success'):
            return Response({
                'success': True,
                'checkout_request_id': payment.checkout_request_id,
                'merchant_request_id': payment.merchant_request_id,
                'message': 'STK Push sent to your phone. Please enter your M-Pesa PIN to complete payment.',
                'vote_count': vote_count,
                'payment_id': payment.id,
            })
        else:
            # Mark payment as failed
            payment.status = 'failed'
            payment.save()
            return Response({
                'success': False,
                'error': stk_result.get('error', 'Failed to initiate STK Push.'),
                'payment_id': payment.id,
            }, status=status.HTTP_502_BAD_GATEWAY)

    @action(detail=True, methods=['post'])
    def initiate_ticket_payment(self, request, pk=None):
        event = self.get_object()

        serializer = STKPushTicketRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phone_number = serializer.validated_data['phone_number']
        full_name = serializer.validated_data['full_name']
        email = serializer.validated_data['email']
        ticket_breakdown = serializer.validated_data['ticket_breakdown']

        categories = TicketCategory.objects.filter(event=event, is_active=True, id__in=ticket_breakdown.keys())
        categories_by_id = {c.id: c for c in categories}

        if not categories_by_id:
            return Response({'error': 'No valid ticket categories found for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        total_qty = 0
        total_amount = Decimal('0.00')
        for category_id, qty in ticket_breakdown.items():
            category = categories_by_id.get(int(category_id))
            if not category:
                return Response({'error': f'Invalid ticket category: {category_id}'}, status=status.HTTP_400_BAD_REQUEST)
            if category.available and qty > int(category.available):
                return Response({'error': f'Only {category.available} ticket(s) available for {category.name}.'}, status=status.HTTP_400_BAD_REQUEST)
            total_qty += int(qty)
            total_amount += (category.price * int(qty))

        if total_amount <= 0:
            return Response({'error': 'Selected ticket total is free. Use free registration instead.'}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            event=event,
            phone_number=phone_number,
            amount=total_amount,
            status='pending',
            payment_type='ticket',
            full_name=full_name,
            email=email,
            ticket_breakdown=ticket_breakdown,
            ticket_quantity=total_qty,
        )

        callback_url = getattr(settings, 'MPESA_CALLBACK_URL', '')
        if not callback_url:
            host = request.get_host()
            scheme = 'https' if request.is_secure() else 'http'
            callback_url = f"{scheme}://{host}/api/mpesa-callback/"

        stk_result = initiate_stk_push(
            phone_number=phone_number,
            amount=float(total_amount),
            account_reference=f"TICKET{event.id}",
            transaction_desc=f"Tickets for {event.title}",
            callback_url=callback_url,
        )

        payment.checkout_request_id = stk_result.get('checkout_request_id') or ''
        payment.merchant_request_id = stk_result.get('merchant_request_id') or ''
        payment.stk_response = stk_result
        payment.save()

        if stk_result.get('success'):
            return Response({
                'success': True,
                'checkout_request_id': payment.checkout_request_id,
                'merchant_request_id': payment.merchant_request_id,
                'message': 'STK Push sent to your phone. Please enter your M-Pesa PIN to complete payment.',
                'payment_id': payment.id,
                'ticket_count': total_qty,
                'amount': str(total_amount),
            })
        payment.status = 'failed'
        payment.save()
        return Response({
            'success': False,
            'error': stk_result.get('error', 'Failed to initiate STK Push.'),
            'payment_id': payment.id,
        }, status=status.HTTP_502_BAD_GATEWAY)

    def _process_ticket_payment(self, payment, event):
        event_year = event.start_date.year
        ticket_breakdown = payment.ticket_breakdown or {}
        tickets = []
        emails_sent = []

        def create_and_email_ticket(ticket_category=None):
            ticket_code = generate_ticket_code(event.ticket_prefix, event_year)
            ticket = Ticket.objects.create(
                event=event,
                ticket_category=ticket_category,
                payment=payment,
                ticket_code=ticket_code,
                full_name=payment.full_name or payment.phone_number,
                email=payment.email or '',
                phone=payment.phone_number,
            )
            
            # Generate PDF and send email
            if ticket.email:
                try:
                    pdf_buffer = generate_ticket_pdf(ticket, event)
                    email_sent = send_ticket_email(ticket, event, pdf_buffer)
                    if email_sent:
                        emails_sent.append(ticket.ticket_code)
                except Exception as e:
                    # Log error but don't fail ticket creation
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.error(f"Failed to send ticket email for {ticket.ticket_code}: {e}")
            
            return ticket

        if ticket_breakdown:
            for category_id, qty in ticket_breakdown.items():
                try:
                    ticket_category = TicketCategory.objects.get(id=int(category_id), event=event)
                except TicketCategory.DoesNotExist:
                    continue

                qty = max(1, int(qty))
                for _ in range(qty):
                    ticket = create_and_email_ticket(ticket_category)
                    tickets.append({'ticket_id': ticket.id, 'ticket_code': ticket.ticket_code, 'ticket_category': ticket_category.id, 'email_sent': ticket.ticket_code in emails_sent})

                ticket_category.available = max(0, int(ticket_category.available or 0) - qty)
                ticket_category.save(update_fields=['available'])
        else:
            ticket_category = payment.ticket_category
            if ticket_category and ticket_category.event_id != event.id:
                ticket_category = None

            quantity = int(payment.ticket_quantity or 1)
            quantity = max(1, quantity)

            for _ in range(quantity):
                ticket = create_and_email_ticket(ticket_category)
                tickets.append({'ticket_id': ticket.id, 'ticket_code': ticket.ticket_code, 'ticket_category': ticket_category.id if ticket_category else None, 'email_sent': ticket.ticket_code in emails_sent})

            if ticket_category:
                ticket_category.available = max(0, int(ticket_category.available or 0) - quantity)
                ticket_category.save(update_fields=['available'])

        # Send Telegram notification about ticket sales
        if tickets:
            try:
                message = f"""🎫 <b>New Ticket Purchase</b>

Event: {event.title}
Buyer: {payment.full_name}
Phone: {payment.phone_number}
Tickets: {len(tickets)}
Amount: KES {payment.amount}

Ticket Codes: {', '.join([t['ticket_code'] for t in tickets])}
Emails Sent: {len(emails_sent)}/{len(tickets)}"""
                send_telegram_message(message)
            except:
                pass

        return {'tickets': tickets, 'ticket_count': len(tickets), 'emails_sent': len(emails_sent)}

    def _process_vote_payment(self, payment, event, request):
        """Calculate and create vote transactions after successful payment."""
        vote_count = calculate_vote_count(payment.amount, event.vote_price)

        if vote_count == 0:
            return {'error': 'Payment amount is less than vote price. No votes created.'}

        contestant_id = request.data.get('contestant_id') if request else None
        if not contestant_id:
            contestant_id = payment.contestant_id

        if not contestant_id:
            return {'error': 'contestant_id is required for vote processing.'}

        try:
            contestant = Contestant.objects.get(id=contestant_id, event=event, is_active=True)
        except Contestant.DoesNotExist:
            return {'error': 'Contestant not found or not active in this event.'}

        vote = VoteTransaction.objects.create(
            event=event,
            contestant=contestant,
            payment=payment,
            vote_count=vote_count,
            phone_number=payment.phone_number,
            mpesa_code=payment.mpesa_code,
            status='successful',
            ip_address=self._get_client_ip(request),
        )

        return {'vote_id': vote.id, 'vote_count': vote_count, 'contestant': contestant.name}

    @staticmethod
    def _get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


# ── EventCategory ViewSet ────────────────────────────────────────────────────

class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ── TicketCategory ViewSet ───────────────────────────────────────────────────

class TicketCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketCategory.objects.filter(is_active=True)
    serializer_class = TicketCategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['event']


# ── Contestant ViewSet ───────────────────────────────────────────────────────

class ContestantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contestant.objects.filter(is_active=True).select_related('event', 'contestant_category')
    serializer_class = ContestantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['event', 'is_active', 'contestant_category']
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ContestantPublicSerializer
        return ContestantSerializer

    @action(detail=True, methods=['get'])
    def public_page(self, request, pk=None):
        """Get public contestant data for shareable pages"""
        contestant = self.get_object()
        serializer = ContestantPublicSerializer(contestant)
        return Response(serializer.data)


# ── Payment ViewSet ──────────────────────────────────────────────────────────

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().select_related('event', 'verified_by')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event', 'status', 'payment_type']
    search_fields = ['mpesa_code', 'phone_number']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer

    def perform_create(self, serializer):
        payment = serializer.save()

        if payment.status == 'successful':
            if self.request and self.request.user and self.request.user.is_authenticated:
                payment.verified_by = self.request.user
                payment.verified_at = timezone.now()
                payment.save(update_fields=['verified_by', 'verified_at', 'updated_at'])

            results = {}
            if payment.payment_type == 'ticket':
                if not payment.tickets.exists():
                    event = payment.event
                    event_year = event.start_date.year
                    created = []
                    ticket_breakdown = payment.ticket_breakdown or {}
                    if ticket_breakdown:
                        for category_id, qty in ticket_breakdown.items():
                            try:
                                ticket_category = TicketCategory.objects.get(id=int(category_id), event=event)
                            except TicketCategory.DoesNotExist:
                                continue

                            qty = max(1, int(qty))
                            for _ in range(qty):
                                ticket_code = generate_ticket_code(event.ticket_prefix, event_year)
                                ticket = Ticket.objects.create(
                                    event=event,
                                    ticket_category=ticket_category,
                                    payment=payment,
                                    ticket_code=ticket_code,
                                    full_name=payment.full_name or payment.phone_number,
                                    email=payment.email or '',
                                    phone=payment.phone_number,
                                )
                                created.append({'ticket_id': ticket.id, 'ticket_code': ticket.ticket_code, 'ticket_category': ticket_category.id})

                            ticket_category.available = max(0, int(ticket_category.available or 0) - qty)
                            ticket_category.save(update_fields=['available'])
                    else:
                        ticket_category = payment.ticket_category
                        if ticket_category and ticket_category.event_id != event.id:
                            ticket_category = None

                        quantity = int(payment.ticket_quantity or 1)
                        quantity = max(1, quantity)

                        for _ in range(quantity):
                            ticket_code = generate_ticket_code(event.ticket_prefix, event_year)
                            ticket = Ticket.objects.create(
                                event=event,
                                ticket_category=ticket_category,
                                payment=payment,
                                ticket_code=ticket_code,
                                full_name=payment.full_name or payment.phone_number,
                                email=payment.email or '',
                                phone=payment.phone_number,
                            )
                            created.append({'ticket_id': ticket.id, 'ticket_code': ticket.ticket_code, 'ticket_category': ticket_category.id if ticket_category else None})

                        if ticket_category:
                            ticket_category.available = max(0, int(ticket_category.available or 0) - quantity)
                            ticket_category.save(update_fields=['available'])

                    results = {'tickets': created, 'ticket_count': len(created)}
            elif payment.payment_type == 'vote':
                if payment.contestant_id and not payment.vote_transactions.exists():
                    event = payment.event
                    vote_count = calculate_vote_count(payment.amount, event.vote_price)
                    if vote_count > 0:
                        vote = VoteTransaction.objects.create(
                            event=event,
                            contestant=payment.contestant,
                            payment=payment,
                            vote_count=vote_count,
                            phone_number=payment.phone_number,
                            mpesa_code=payment.mpesa_code or '',
                            status='successful',
                        )
                        results = {'vote_id': vote.id, 'vote_count': vote_count, 'contestant': payment.contestant.name}

            AuditLog.objects.create(
                action='payment_verified',
                actor=self.request.user.username if self.request.user.is_authenticated else 'admin',
                details=json.dumps({
                    'payment_id': payment.id,
                    'mpesa_code': payment.mpesa_code,
                    'amount': str(payment.amount),
                    'payment_type': payment.payment_type,
                    'event_id': payment.event_id,
                    'results': results,
                }),
                event=payment.event,
            )


# ── Ticket ViewSet ───────────────────────────────────────────────────────────

class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ticket.objects.all().select_related('event', 'ticket_category')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event', 'ticket_category', 'is_used']
    search_fields = ['ticket_code', 'full_name', 'email', 'phone']
    ordering_fields = ['issued_at', 'created_at']
    ordering = ['-issued_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TicketDetailSerializer
        return TicketSerializer

    @action(detail=False, methods=['get'])
    def lookup(self, request):
        """Look up a ticket by ticket_code via query param."""
        code = request.query_params.get('code', '').strip()
        if not code:
            return Response(
                {'error': 'code query parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            ticket = Ticket.objects.get(ticket_code=code)
            serializer = TicketDetailSerializer(ticket)
            return Response(serializer.data)
        except Ticket.DoesNotExist:
            return Response(
                {'error': f'Ticket with code "{code}" not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


# ── VoteTransaction ViewSet ──────────────────────────────────────────────────

class VoteTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VoteTransaction.objects.all().select_related('event', 'contestant', 'payment')
    serializer_class = VoteTransactionSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event', 'contestant', 'status']
    search_fields = ['mpesa_code', 'phone_number']
    ordering_fields = ['created_at', 'vote_count']
    ordering = ['-created_at']


# ── AuditLog ViewSet ─────────────────────────────────────────────────────────

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().select_related('event')
    serializer_class = AuditLogSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['action', 'event']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    permission_classes = [IsAdminUser]


# ── Standalone API Endpoints ─────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_votes_by_phone(request):
    """Public endpoint: verify all votes for a phone number across all events."""
    phone = request.query_params.get('phone', '').strip()
    if not phone:
        return Response(
            {'error': 'phone query parameter is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Search by last 9 digits for flexibility
    search_digits = phone[-9:] if len(phone) >= 9 else phone
    votes = VoteTransaction.objects.filter(
        phone_number__contains=search_digits
    ).select_related('contestant', 'event').order_by('-created_at')

    from .utils import mask_phone_number
    serializer = VoteVerifySerializer(votes, many=True)
    return Response({
        'phone_masked': mask_phone_number(phone),
        'total_transactions': votes.count(),
        'votes': serializer.data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def ticket_lookup(request):
    """Public endpoint: look up a ticket by ticket_code."""
    code = request.query_params.get('code', '').strip()
    if not code:
        return Response(
            {'error': 'code query parameter is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        ticket = Ticket.objects.select_related('event', 'ticket_category').get(ticket_code=code)
        serializer = TicketDetailSerializer(ticket)
        return Response(serializer.data)
    except Ticket.DoesNotExist:
        return Response(
            {'error': f'Ticket with code "{code}" not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def mpesa_callback(request):
    """
    M-Pesa Daraja STK Push callback endpoint.
    M-Pesa POSTs the transaction result here after the customer completes the PIN entry.
    """
    try:
        result = process_callback(request.body)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    checkout_request_id = result.get('checkout_request_id', '')

    if not checkout_request_id:
        return Response(
            {'error': 'Missing CheckoutRequestID in callback'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        payment = Payment.objects.get(checkout_request_id=checkout_request_id)
    except Payment.DoesNotExist:
        return Response(
            {'error': f'Payment with CheckoutRequestID {checkout_request_id} not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Update payment with callback data
    payment.stk_response['callback'] = result
    payment.save()

    if result.get('success'):
        if payment.status == 'successful':
            return Response({'status': 'success', 'message': 'Payment already processed'})

        payment.status = 'successful'
        payment.mpesa_code = result.get('mpesa_receipt_number') or payment.mpesa_code
        payment.phone_number = result.get('phone_number') or payment.phone_number
        payment.save()

        event = payment.event
        processing = {}

        if payment.payment_type == 'vote':
            contestant = payment.contestant
            if contestant and not payment.vote_transactions.exists():
                vote_count = calculate_vote_count(payment.amount, event.vote_price)
                if vote_count > 0:
                    vote = VoteTransaction.objects.create(
                        event=event,
                        contestant=contestant,
                        payment=payment,
                        vote_count=vote_count,
                        phone_number=payment.phone_number,
                        mpesa_code=payment.mpesa_code or '',
                        status='successful',
                        ip_address=None,
                    )
                    processing = {'vote_id': vote.id, 'vote_count': vote_count, 'contestant': contestant.name}
                    
                    # Send Telegram notification
                    telegram_msg = (
                        f"🗳 <b>New Vote Confirmed!</b>\n\n"
                        f"<b>Event:</b> {event.title}\n"
                        f"<b>Contestant:</b> {contestant.name}\n"
                        f"<b>Votes:</b> {vote_count}\n"
                        f"<b>Amount:</b> KES {payment.amount}\n"
                        f"<b>Phone:</b> {payment.phone_number}\n"
                        f"<b>M-Pesa:</b> {payment.mpesa_code}"
                    )
                    send_telegram_message(telegram_msg)
        elif payment.payment_type == 'ticket':
            if not payment.tickets.exists():
                ticket_category_ids = list((payment.ticket_breakdown or {}).keys())
                categories = TicketCategory.objects.filter(event=event, id__in=ticket_category_ids)
                categories_by_id = {c.id: c for c in categories}

                issued = []
                event_year = event.start_date.year
                if payment.ticket_breakdown:
                    for category_id, qty in payment.ticket_breakdown.items():
                        category = categories_by_id.get(int(category_id))
                        if not category:
                            continue
                        qty = max(1, int(qty))
                        for _ in range(qty):
                            code = generate_ticket_code(event.ticket_prefix, event_year)
                            ticket = Ticket.objects.create(
                                event=event,
                                ticket_category=category,
                                payment=payment,
                                ticket_code=code,
                                full_name=payment.full_name or payment.phone_number,
                                email=payment.email or '',
                                phone=payment.phone_number,
                            )
                            issued.append(ticket.ticket_code)
                        category.available = max(0, int(category.available or 0) - qty)
                        category.save(update_fields=['available'])
                processing = {'ticket_codes': issued, 'ticket_count': len(issued)}

                # Send Telegram notification
                telegram_msg = (
                    f"🎟 <b>Tickets Issued!</b>\n\n"
                    f"<b>Event:</b> {event.title}\n"
                    f"<b>Customer:</b> {payment.full_name}\n"
                    f"<b>Amount:</b> KES {payment.amount}\n"
                    f"<b>Tickets:</b> {len(issued)}\n"
                    f"<b>Phone:</b> {payment.phone_number}\n"
                    f"<b>M-Pesa:</b> {payment.mpesa_code}"
                )
                send_telegram_message(telegram_msg)

                if payment.email and issued:
                    send_mail(
                        subject=f"Your Tickets — {event.title}",
                        message=(
                            f"Hello {payment.full_name or ''},\n\n"
                            f"Your payment was received successfully.\n"
                            f"Event: {event.title}\n"
                            f"Tickets: {', '.join(issued)}\n\n"
                            f"You can verify tickets here:\n"
                            f"https://misscultureglobalkenya.com/events/{event.id}\n"
                        ),
                        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', None),
                        recipient_list=[payment.email],
                        fail_silently=True,
                    )

        AuditLog.objects.create(
            action='payment_verified',
            actor='system',
            details=json.dumps({
                'payment_id': payment.id,
                'mpesa_code': payment.mpesa_code,
                'amount': str(payment.amount),
                'payment_type': payment.payment_type,
                'processing': processing,
                'source': 'daraja_callback',
            }),
            event=event,
        )

        return Response({'status': 'success', 'message': 'Payment processed successfully', 'processing': processing})
    else:
        # Payment failed or cancelled
        payment.status = 'failed'
        payment.save()
        return Response({'status': 'failed', 'message': result.get('result_desc', 'Payment failed')})


# ── Helper ───────────────────────────────────────────────────────────────────

def _cloudinary_url(field_value, resource_type='image'):
    import cloudinary as cd
    if not field_value:
        return None
    url = str(field_value)
    if url.startswith(('http://', 'https://')):
        return url
    return cd.CloudinaryResource(url, default_resource_type=resource_type).build_url()
