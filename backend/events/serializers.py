from rest_framework import serializers
from django.db.models import Sum, Count
from .models import (
    Event, EventInquiry, EventCategory, EventSettings,
    TicketCategory, Contestant, Payment, Ticket, VoteTransaction, AuditLog
)
import cloudinary


def _cloudinary_url(field_value, resource_type='image'):
    if not field_value:
        return None
    url = str(field_value)
    if url.startswith(('http://', 'https://')):
        return url
    return cloudinary.CloudinaryResource(url, default_resource_type=resource_type).build_url()


# ── Event ────────────────────────────────────────────────────────────────────

class EventSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    contestant_count = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    is_voting_active = serializers.ReadOnlyField()

    def get_featured_image_url(self, obj):
        return _cloudinary_url(obj.featured_image)

    def get_contestant_count(self, obj):
        return obj.contestants.filter(is_active=True).count()

    def get_total_votes(self, obj):
        result = obj.vote_transactions.filter(status='successful').aggregate(
            total=Sum('vote_count')
        )
        return result['total'] or 0

    class Meta:
        model = Event
        fields = '__all__'


class EventListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views"""
    featured_image_url = serializers.SerializerMethodField()
    is_voting_active = serializers.ReadOnlyField()
    contestant_count = serializers.SerializerMethodField()

    def get_featured_image_url(self, obj):
        return _cloudinary_url(obj.featured_image)

    def get_contestant_count(self, obj):
        return obj.contestants.filter(is_active=True).count()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'event_type', 'event_status', 'status',
            'start_date', 'end_date', 'venue_name', 'city', 'country',
            'featured_image_url', 'ticket_price', 'featured', 'published',
            'voting_enabled', 'vote_price', 'is_voting_active',
            'result_visibility', 'contestant_count',
            'payment_method', 'paybill_number', 'till_number',
            'account_number', 'account_name',
        ]


# ── EventInquiry ─────────────────────────────────────────────────────────────

class EventInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInquiry
        fields = '__all__'


# ── EventCategory ────────────────────────────────────────────────────────────

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'


# ── EventSettings ────────────────────────────────────────────────────────────

class EventSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSettings
        fields = '__all__'


# ── TicketCategory ───────────────────────────────────────────────────────────

class TicketCategorySerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = TicketCategory
        fields = '__all__'


# ── Contestant ───────────────────────────────────────────────────────────────

class ContestantSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_slug = serializers.CharField(source='event.slug', read_only=True)

    def get_photo_url(self, obj):
        return _cloudinary_url(obj.photo)

    def get_vote_count(self, obj):
        result = obj.vote_transactions.filter(status='successful').aggregate(
            total=Sum('vote_count')
        )
        return result['total'] or 0

    class Meta:
        model = Contestant
        fields = [
            'id', 'event', 'event_title', 'event_slug', 'name', 'bio',
            'photo', 'photo_url', 'contestant_number', 'slug', 'is_active',
            'vote_count', 'created_at', 'updated_at',
        ]


class ContestantPublicSerializer(serializers.ModelSerializer):
    """Public-facing contestant data for shareable pages"""
    photo_url = serializers.SerializerMethodField()
    vote_count = serializers.SerializerMethodField()
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_slug = serializers.CharField(source='event.slug', read_only=True)

    def get_photo_url(self, obj):
        return _cloudinary_url(obj.photo)

    def get_vote_count(self, obj):
        event = obj.event
        # Respect result_visibility settings
        if event.result_visibility == 'no_public':
            return None
        result = obj.vote_transactions.filter(status='successful').aggregate(
            total=Sum('vote_count')
        )
        return result['total'] or 0

    class Meta:
        model = Contestant
        fields = [
            'id', 'name', 'bio', 'photo_url', 'contestant_number',
            'slug', 'vote_count', 'event_title', 'event_slug',
        ]


# ── Payment ──────────────────────────────────────────────────────────────────

class PaymentSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    verified_by_name = serializers.CharField(source='verified_by.username', read_only=True, default=None)

    class Meta:
        model = Payment
        fields = [
            'id', 'event', 'event_title', 'phone_number', 'mpesa_code',
            'amount', 'status', 'payment_type', 'verified_by', 'verified_by_name',
            'verified_at', 'created_at', 'updated_at',
        ]
        read_only_fields = ['verified_by', 'verified_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments (admin manual verification)"""
    class Meta:
        model = Payment
        fields = [
            'event', 'phone_number', 'mpesa_code', 'amount',
            'status', 'payment_type',
        ]

    def validate_mpesa_code(self, value):
        # Allow blank/null for pending payments
        if not value:
            return value
        if Payment.objects.filter(mpesa_code=value).exists():
            raise serializers.ValidationError("This M-Pesa transaction code has already been used.")
        return value


# ── Ticket ───────────────────────────────────────────────────────────────────

class TicketSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    ticket_category_name = serializers.CharField(source='ticket_category.name', read_only=True, default=None)

    class Meta:
        model = Ticket
        fields = [
            'id', 'event', 'event_title', 'ticket_category', 'ticket_category_name',
            'ticket_code', 'full_name', 'email', 'phone',
            'is_used', 'issued_at',
        ]
        read_only_fields = ['ticket_code', 'issued_at']


class TicketDetailSerializer(serializers.ModelSerializer):
    """Detailed ticket for public verification"""
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_slug = serializers.CharField(source='event.slug', read_only=True)
    ticket_category_name = serializers.CharField(source='ticket_category.name', read_only=True, default=None)
    featured_image_url = serializers.SerializerMethodField()

    def get_featured_image_url(self, obj):
        return _cloudinary_url(obj.event.featured_image)

    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_code', 'full_name', 'email', 'phone',
            'event_title', 'event_slug', 'ticket_category_name',
            'is_used', 'issued_at', 'featured_image_url',
        ]


# ── VoteTransaction ──────────────────────────────────────────────────────────

class VoteTransactionSerializer(serializers.ModelSerializer):
    contestant_name = serializers.CharField(source='contestant.name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = VoteTransaction
        fields = [
            'id', 'event', 'event_title', 'contestant', 'contestant_name',
            'vote_count', 'phone_number', 'mpesa_code', 'status',
            'ip_address', 'created_at', 'updated_at',
        ]
        read_only_fields = ['vote_count', 'ip_address']


# ── AuditLog ─────────────────────────────────────────────────────────────────

class AuditLogSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = [
            'id', 'action', 'actor', 'details', 'event', 'event_title', 'created_at',
        ]
        read_only_fields = fields  # Fully read-only


# ── Live Results ─────────────────────────────────────────────────────────────

class LiveResultSerializer(serializers.Serializer):
    """Serializer for live voting results per event"""
    contestant_id = serializers.IntegerField()
    contestant_name = serializers.CharField()
    contestant_number = serializers.IntegerField()
    slug = serializers.CharField()
    photo_url = serializers.CharField(allow_null=True)
    vote_count = serializers.IntegerField(allow_null=True)
    rank = serializers.IntegerField(allow_null=True)


class VoteVerifySerializer(serializers.Serializer):
    """Serializer for vote verification by phone number"""
    event_title = serializers.CharField()
    contestant_name = serializers.CharField()
    vote_count = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    mpesa_code = serializers.CharField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField()
