import json
import uuid
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
    TicketCategory, Contestant, GuestSpeaker, Payment, Contribution, Ticket, VoteTransaction, AuditLog
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
    ContributionCheckoutSerializer,
)
from .utils import (
    generate_ticket_code, calculate_vote_count, 
    send_telegram_message, send_ticket_email
)
from .ticket_pdf import generate_ticket_pdf
from .daraja import initiate_stk_push, process_callback
from .intasend import create_checkout, normalize_collection_payload, check_payment_status
from .pesapal import submit_order, get_transaction_status


def _absolute_backend_url(request, path):
    """Build a full backend URL for external callbacks.

    If INTASEND_CALLBACK_URL is configured, derive the base (scheme + host)
    from it so the *path* argument is always honoured.
    """
    configured = getattr(settings, 'INTASEND_CALLBACK_URL', '')
    if configured:
        from urllib.parse import urlparse
        parsed = urlparse(configured)
        return f"{parsed.scheme}://{parsed.netloc}{path}"
    host = request.get_host()
    scheme = 'https' if request.is_secure() else 'http'
    return f"{scheme}://{host}{path}"


def _frontend_url(path=''):
    base = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
    return f"{base}{path}"


def _short_payment_reference(result, fallback=''):
    reference = result.get('mpesa_reference') or result.get('invoice_id') or fallback or ''
    return str(reference)[:20]


# ── Event ViewSet ────────────────────────────────────────────────────────────

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.filter(published=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'event_status', 'featured', 'city', 'country', 'voting_enabled']
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

        api_ref = f"MCK-VOTE-{payment.id}"
        checkout_result = create_checkout(
            email=f"vote-{payment.id}@misscultureglobalkenya.com",
            amount=amount,
            api_ref=api_ref,
            comment=f"Vote for {contestant.name}",
            phone_number=phone_number,
            name=contestant.name,
            callback_url=_absolute_backend_url(request, '/api/events/intasend-callback/'),
            redirect_url=_frontend_url('/voting'),
        )

        payment.checkout_request_id = checkout_result.get('invoice_id') or ''
        payment.merchant_request_id = api_ref
        payment.stk_response = checkout_result
        payment.save()

        if checkout_result.get('success'):
            return Response({
                'success': True,
                'checkout_request_id': payment.checkout_request_id,
                'merchant_request_id': payment.merchant_request_id,
                'checkout_url': checkout_result.get('checkout_url'),
                'message': 'Continue to IntaSend checkout to complete payment.',
                'vote_count': vote_count,
                'payment_id': payment.id,
            })
        else:
            # Mark payment as failed
            payment.status = 'failed'
            payment.save()
            return Response({
                'success': False,
                'error': checkout_result.get('error', 'Failed to create IntaSend checkout.'),
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

        api_ref = f"MCK-TICKET-{payment.id}"
        checkout_result = create_checkout(
            email=email,
            amount=total_amount,
            api_ref=api_ref,
            comment=f"Tickets for {event.title}",
            phone_number=phone_number,
            name=full_name,
            callback_url=_absolute_backend_url(request, '/api/events/intasend-callback/'),
            redirect_url=_frontend_url(f'/events/{event.id}/checkout/success'),
        )

        payment.checkout_request_id = checkout_result.get('invoice_id') or ''
        payment.merchant_request_id = api_ref
        payment.stk_response = checkout_result
        payment.save()

        if checkout_result.get('success'):
            return Response({
                'success': True,
                'checkout_request_id': payment.checkout_request_id,
                'merchant_request_id': payment.merchant_request_id,
                'checkout_url': checkout_result.get('checkout_url'),
                'message': 'Continue to IntaSend checkout to complete payment.',
                'payment_id': payment.id,
                'ticket_count': total_qty,
                'amount': str(total_amount),
            })
        payment.status = 'failed'
        payment.save()
        return Response({
            'success': False,
            'error': checkout_result.get('error', 'Failed to create IntaSend checkout.'),
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

    def retrieve(self, request, *args, **kwargs):
        payment = self.get_object()
        if payment.status == 'pending' and payment.checkout_request_id:
            try:
                result = check_payment_status(payment.checkout_request_id)
                payment.stk_response['intasend_status'] = result.get('raw', result)
                if result.get('is_successful'):
                    payment.status = 'successful'
                    payment.mpesa_code = _short_payment_reference(result, payment.mpesa_code)
                    payment.save()
                    _process_successful_payment(payment)
                elif result.get('is_failed'):
                    payment.status = 'failed'
                    payment.save()
                else:
                    payment.save()
            except Exception:
                pass
        serializer = self.get_serializer(payment)
        return Response(serializer.data)

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
    filterset_fields = ['event', 'ticket_category', 'payment', 'is_used']
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
@permission_classes([AllowAny])
def initiate_contribution_payment(request):
    serializer = ContributionCheckoutSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    merchant_ref = f"MCK-CONTRIB-{uuid.uuid4().hex[:12].upper()}"

    # Split full name into first/last for PesaPal billing
    name_parts = data['full_name'].strip().split(maxsplit=1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ''

    contribution = Contribution.objects.create(
        full_name=data['full_name'],
        email=data['email'],
        phone_number=data.get('phone_number', ''),
        amount=data['amount'],
        pesapal_merchant_ref=merchant_ref,
    )

    ipn_id = getattr(settings, 'PESAPAL_IPN_ID', '')
    callback_url = _absolute_backend_url(request, '/api/events/pesapal-redirect/')
    frontend_success = _frontend_url('/contribute?payment=success')

    result = submit_order(
        order_id=merchant_ref,
        amount=contribution.amount,
        currency='KES',
        description='Contribution to Miss Culture Global Kenya',
        callback_url=callback_url,
        notification_id=ipn_id,
        first_name=first_name,
        last_name=last_name,
        email=contribution.email,
        phone_number=contribution.phone_number,
    )

    contribution.pesapal_response = result.get('raw', {})
    contribution.pesapal_tracking_id = result.get('order_tracking_id', '')

    if not result.get('success'):
        contribution.status = 'failed'
        contribution.save()
        return Response({
            'success': False,
            'error': result.get('error', 'Failed to create PesaPal order.'),
            'contribution_id': contribution.id,
        }, status=status.HTTP_502_BAD_GATEWAY)

    contribution.save()
    return Response({
        'success': True,
        'redirect_url': result.get('redirect_url'),
        'order_tracking_id': contribution.pesapal_tracking_id,
        'merchant_ref': contribution.pesapal_merchant_ref,
        'contribution_id': contribution.id,
        'message': 'Continue to PesaPal checkout to complete your contribution.',
    })


def _process_successful_payment(payment):
    event = payment.event
    processor = EventViewSet()
    if payment.payment_type == 'ticket':
        if payment.tickets.exists():
            return {'message': 'Tickets already issued.'}
        return processor._process_ticket_payment(payment, event)
    if payment.payment_type == 'vote':
        if payment.vote_transactions.exists():
            return {'message': 'Votes already counted.'}
        return processor._process_vote_payment(payment, event, None)
    return {}


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def intasend_callback(request):
    """
    IntaSend collection webhook endpoint.
    IntaSend sends collection payloads whenever the payment state changes.
    """
    challenge = getattr(settings, 'INTASEND_WEBHOOK_CHALLENGE', '')
    if challenge and request.data.get('challenge') != challenge:
        return Response({'error': 'Invalid webhook challenge.'}, status=status.HTTP_403_FORBIDDEN)

    result = normalize_collection_payload(request.data)
    api_ref = result.get('api_ref')
    invoice_id = result.get('invoice_id')

    if not api_ref and not invoice_id:
        return Response({'error': 'Missing IntaSend api_ref or invoice_id.'}, status=status.HTTP_400_BAD_REQUEST)

    payment = Payment.objects.filter(merchant_request_id=api_ref).first()
    if not payment and invoice_id:
        payment = Payment.objects.filter(checkout_request_id=invoice_id).first()

    if payment:
        payment.stk_response['intasend_callback'] = request.data
        if invoice_id and not payment.checkout_request_id:
            payment.checkout_request_id = invoice_id

        processing = {}
        if result.get('is_successful'):
            if payment.status != 'successful':
                payment.status = 'successful'
                payment.mpesa_code = _short_payment_reference(result, payment.mpesa_code)
                payment.save()
                processing = _process_successful_payment(payment)
            else:
                payment.save()
                processing = {'message': 'Payment already processed.'}
        elif result.get('is_failed'):
            payment.status = 'failed'
            payment.save()
        else:
            payment.save()

        if result.get('is_successful'):
            AuditLog.objects.create(
                action='payment_verified',
                actor='system',
                details=json.dumps({
                    'payment_id': payment.id,
                    'amount': str(payment.amount),
                    'payment_type': payment.payment_type,
                    'source': 'intasend_callback',
                    'invoice_id': invoice_id,
                    'api_ref': api_ref,
                    'processing': processing,
                }),
                event=payment.event,
            )

        return Response({'status': 'success', 'processing': processing})

    contribution = Contribution.objects.filter(intasend_api_ref=api_ref).first()
    if not contribution and invoice_id:
        contribution = Contribution.objects.filter(intasend_invoice_id=invoice_id).first()

    if contribution:
        contribution.intasend_response['intasend_callback'] = request.data
        if invoice_id and not contribution.intasend_invoice_id:
            contribution.intasend_invoice_id = invoice_id
        if result.get('is_successful'):
            contribution.status = 'successful'
            send_telegram_message(
                f"<b>New Contribution Confirmed</b>\n\n"
                f"Name: {contribution.full_name}\n"
                f"Amount: KES {contribution.amount}\n"
                f"Phone: {contribution.phone_number or '-'}\n"
                f"Invoice: {invoice_id or '-'}"
            )
        elif result.get('is_failed'):
            contribution.status = 'failed'
        contribution.save()
        return Response({'status': 'success'})

    return Response({'error': 'Matching payment or contribution not found.'}, status=status.HTTP_404_NOT_FOUND)


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


# ── PesaPal IPN + Redirect ────────────────────────────────────────────────────

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def pesapal_ipn_callback(request):
    """
    PesaPal IPN (Instant Payment Notification) endpoint.
    PesaPal sends a GET request with OrderTrackingId and OrderMerchantReference
    whenever the payment state changes.
    """
    tracking_id = request.query_params.get('OrderTrackingId') or request.query_params.get('order_tracking_id', '')
    merchant_ref = request.query_params.get('OrderMerchantReference') or request.query_params.get('order_merchant_reference', '')

    if not tracking_id and not merchant_ref:
        return Response({'error': 'Missing OrderTrackingId or OrderMerchantReference.'}, status=status.HTTP_400_BAD_REQUEST)

    # Look up the contribution
    contribution = None
    if merchant_ref:
        contribution = Contribution.objects.filter(pesapal_merchant_ref=merchant_ref).first()
    if not contribution and tracking_id:
        contribution = Contribution.objects.filter(pesapal_tracking_id=tracking_id).first()

    if not contribution:
        return Response({'error': 'Contribution not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Verify status with PesaPal API
    status_result = get_transaction_status(
        order_tracking_id=tracking_id or contribution.pesapal_tracking_id,
        merchant_reference=merchant_ref or contribution.pesapal_merchant_ref,
    )
    payment_status = status_result.get('payment_status', 'UNKNOWN')

    contribution.pesapal_response['ipn_status'] = status_result.get('raw', {})

    if payment_status == 'COMPLETED':
        if contribution.status != 'successful':
            contribution.status = 'successful'
            contribution.save()
            send_telegram_message(
                f"<b>New Contribution Confirmed</b>\n\n"
                f"Name: {contribution.full_name}\n"
                f"Amount: KES {contribution.amount}\n"
                f"Phone: {contribution.phone_number or '-'}\n"
                f"Tracking: {tracking_id or '-'}"
            )
        else:
            contribution.save()
    elif payment_status in ('FAILED', 'INVALID'):
        contribution.status = 'failed'
        contribution.save()
    else:
        contribution.save()

    return Response({'status': 'success'})


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def pesapal_payment_redirect(request):
    """
    PesaPal redirects the user's browser here after they complete (or abandon) payment.
    Verifies the status and redirects to the frontend with a status param.
    """
    tracking_id = request.query_params.get('OrderTrackingId') or request.query_params.get('order_tracking_id', '')
    merchant_ref = request.query_params.get('OrderMerchantReference') or request.query_params.get('order_merchant_reference', '')

    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')

    # Try to verify with PesaPal API
    if tracking_id or merchant_ref:
        status_result = get_transaction_status(
            order_tracking_id=tracking_id,
            merchant_reference=merchant_ref,
        )
        payment_status = status_result.get('payment_status', 'UNKNOWN')

        # Update contribution if found
        contribution = None
        if merchant_ref:
            contribution = Contribution.objects.filter(pesapal_merchant_ref=merchant_ref).first()
        if not contribution and tracking_id:
            contribution = Contribution.objects.filter(pesapal_tracking_id=tracking_id).first()

        if contribution:
            if payment_status == 'COMPLETED' and contribution.status != 'successful':
                contribution.status = 'successful'
                contribution.pesapal_response['redirect_status'] = status_result.get('raw', {})
                contribution.save()
                send_telegram_message(
                    f"<b>New Contribution Confirmed</b>\n\n"
                    f"Name: {contribution.full_name}\n"
                    f"Amount: KES {contribution.amount}\n"
                    f"Phone: {contribution.phone_number or '-'}\n"
                    f"Tracking: {tracking_id or '-'}"
                )
            elif payment_status in ('FAILED', 'INVALID'):
                contribution.status = 'failed'
                contribution.save()

        if payment_status == 'COMPLETED':
            from django.shortcuts import redirect
            return redirect(f'{frontend_url}/contribute?payment=success')

    from django.shortcuts import redirect as dj_redirect
    return dj_redirect(f'{frontend_url}/contribute?payment=failed')
