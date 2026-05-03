import json
from decimal import Decimal

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Sum, F, Q

from .models import (
    Event, EventInquiry, EventCategory, EventSettings,
    TicketCategory, Contestant, Payment, Ticket, VoteTransaction, AuditLog
)
from .serializers import (
    EventSerializer, EventListSerializer, EventInquirySerializer,
    EventCategorySerializer, EventSettingsSerializer,
    TicketCategorySerializer, ContestantSerializer, ContestantPublicSerializer,
    PaymentSerializer, PaymentCreateSerializer,
    TicketSerializer, TicketDetailSerializer,
    VoteTransactionSerializer, AuditLogSerializer,
    LiveResultSerializer, VoteVerifySerializer,
)
from .utils import generate_ticket_code, calculate_vote_count


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

    def _process_ticket_payment(self, payment, event):
        """Generate tickets after successful payment verification."""
        # Determine how many tickets to issue based on ticket category
        ticket_category_id = getattr(payment, '_ticket_category_id', None)
        ticket_category = None
        if ticket_category_id:
            try:
                ticket_category = TicketCategory.objects.get(id=ticket_category_id, event=event)
            except TicketCategory.DoesNotExist:
                pass

        # Generate one ticket per payment (can be extended for multiple)
        event_year = event.start_date.year
        ticket_code = generate_ticket_code(event.ticket_prefix, event_year)

        ticket = Ticket.objects.create(
            event=event,
            ticket_category=ticket_category,
            payment=payment,
            ticket_code=ticket_code,
            full_name=payment.phone_number,  # Will be updated by admin
            email='',
            phone=payment.phone_number,
        )

        return {'ticket_id': ticket.id, 'ticket_code': ticket.ticket_code}

    def _process_vote_payment(self, payment, event, request):
        """Calculate and create vote transactions after successful payment."""
        vote_count = calculate_vote_count(payment.amount, event.vote_price)

        if vote_count == 0:
            return {'error': 'Payment amount is less than vote price. No votes created.'}

        # Get contestant — could be specified in payment or request
        contestant_id = request.data.get('contestant_id') if request else None

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


# ── EventInquiry ViewSet ─────────────────────────────────────────────────────

class EventInquiryViewSet(viewsets.ModelViewSet):
    queryset = EventInquiry.objects.all()
    serializer_class = EventInquirySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['inquiry_type', 'status']
    search_fields = ['name', 'organization', 'email', 'event_title']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            inquiry = serializer.save()

            email_subject = f"[Miss Culture Kenya] Event Inquiry: {inquiry.event_title or 'New Inquiry'}"
            plain_body = (
                f"New Event Inquiry\n"
                f"------------------\n"
                f"Name: {inquiry.name}\n"
                f"Organization: {inquiry.organization or 'N/A'}\n"
                f"Email: {inquiry.email}\n"
                f"Phone: {inquiry.phone or 'N/A'}\n"
                f"Event Title: {inquiry.event_title or 'N/A'}\n"
                f"Inquiry Type: {inquiry.inquiry_type}\n\n"
                f"Message:\n{inquiry.message or 'No message provided'}\n\n"
                f"---\nSent via Miss Culture Global Kenya website"
            )
            html_body = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #15803d;">New Event Inquiry — Miss Culture Global Kenya</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">{inquiry.name}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Organization:</td><td style="padding: 8px;">{inquiry.organization or 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:{inquiry.email}">{inquiry.email}</a></td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">{inquiry.phone or 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Event Title:</td><td style="padding: 8px;">{inquiry.event_title or 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Inquiry Type:</td><td style="padding: 8px;">{inquiry.inquiry_type}</td></tr>
                </table>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <h3 style="color: #374151;">Message</h3>
                <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">{inquiry.message or 'No message provided'}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">This inquiry was submitted via the Miss Culture Global Kenya events page.</p>
            </div>
            """
            try:
                send_mail(
                    subject=email_subject,
                    message=plain_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.ADMIN_EMAIL],
                    html_message=html_body,
                    fail_silently=True,
                )
            except Exception:
                pass

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── EventCategory ViewSet ────────────────────────────────────────────────────

class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


# ── EventSettings ViewSet ────────────────────────────────────────────────────

class EventSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventSettings.objects.all()
    serializer_class = EventSettingsSerializer


# ── TicketCategory ViewSet ───────────────────────────────────────────────────

class TicketCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TicketCategory.objects.filter(is_active=True)
    serializer_class = TicketCategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['event']


# ── Contestant ViewSet ───────────────────────────────────────────────────────

class ContestantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contestant.objects.filter(is_active=True).select_related('event')
    serializer_class = ContestantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['event', 'is_active']
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

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer

    def perform_create(self, serializer):
        """When admin creates a payment with status=successful, process it."""
        payment = serializer.save()

        if payment.status == 'successful':
            # Log the creation
            AuditLog.objects.create(
                action='payment_verified',
                actor=self.request.user.username if self.request.user.is_authenticated else 'admin',
                details=json.dumps({
                    'payment_id': payment.id,
                    'mpesa_code': payment.mpesa_code,
                    'amount': str(payment.amount),
                    'payment_type': payment.payment_type,
                    'event_id': payment.event_id,
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


# ── Helper ───────────────────────────────────────────────────────────────────

def _cloudinary_url(field_value, resource_type='image'):
    import cloudinary as cd
    if not field_value:
        return None
    url = str(field_value)
    if url.startswith(('http://', 'https://')):
        return url
    return cd.CloudinaryResource(url, default_resource_type=resource_type).build_url()
