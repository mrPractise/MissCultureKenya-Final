from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
import cloudinary.models


class Event(models.Model):
    """Model for events and appearances"""
    EVENT_TYPES = [
        ('appearance', 'Public Appearance'),
        ('cultural_event', 'Cultural Event'),
        ('charity', 'Charity Event'),
        ('media', 'Media Appearance'),
        ('award', 'Award Ceremony'),
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('other', 'Other'),
    ]

    EVENT_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('voting_open', 'Voting Open'),
        ('voting_closed', 'Voting Closed'),
        ('archived', 'Archived'),
    ]

    RESULT_VISIBILITY_CHOICES = [
        ('full_live', 'Full Live Totals'),
        ('rankings_only', 'Rankings Only'),
        ('hidden', 'Hidden Totals'),
        ('no_public', 'No Public Updates'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('paybill', 'Paybill'),
        ('till_number', 'Till Number'),
        ('both', 'Both'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    event_status = models.CharField(max_length=20, choices=EVENT_STATUS_CHOICES, default='draft')
    # Legacy status field kept for backward compatibility
    status = models.CharField(max_length=20, default='upcoming')

    # Date and time
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_all_day = models.BooleanField(default=False)

    # Location
    venue_name = models.CharField(max_length=200)
    venue_address = models.TextField(blank=True, default='')
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Kenya')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Media
    featured_image = cloudinary.models.CloudinaryField('featured_image', folder='missculture/events', blank=True, null=True)
    gallery = models.ManyToManyField('gallery.Photo', blank=True, related_name='events')

    # Additional info
    capacity = models.PositiveIntegerField(null=True, blank=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ticket_url = models.URLField(blank=True)
    registration_required = models.BooleanField(default=False)
    registration_url = models.URLField(blank=True)

    # Voting configuration
    voting_enabled = models.BooleanField(default=False, help_text="Enable voting for this event")
    vote_price = models.DecimalField(max_digits=10, decimal_places=2, default=10.00, help_text="Price per vote in KES (e.g. 10.00)")
    voting_start = models.DateTimeField(null=True, blank=True, help_text="When voting opens")
    voting_end = models.DateTimeField(null=True, blank=True, help_text="When voting closes")
    result_visibility = models.CharField(max_length=20, choices=RESULT_VISIBILITY_CHOICES, default='full_live', help_text="What the public sees for vote results")

    # Ticketing configuration
    ticket_prefix = models.CharField(max_length=5, blank=True, help_text="Auto-derived from event title. 2-3 char prefix for ticket codes (e.g. FOS)")

    # Payment configuration
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='paybill')
    paybill_number = models.CharField(max_length=20, default='542542')
    till_number = models.CharField(max_length=20, blank=True)
    account_number = models.CharField(max_length=50, default='0310848627615')
    account_name = models.CharField(max_length=200, default='The Misscomm Events')

    # SEO and visibility
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    meta_description = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Events - Event"
        verbose_name_plural = "Events - Events"
        ordering = ['-start_date']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-derive ticket_prefix from title if not set
        if not self.ticket_prefix and self.title:
            self.ticket_prefix = self._derive_prefix(self.title)
        super().save(*args, **kwargs)

    @staticmethod
    def _derive_prefix(title):
        """Derive 2-3 char prefix from title using first consonants of main words."""
        consonants = 'BCDFGHJKLMNPQRSTVWXYZ'
        words = title.upper().split()
        prefix_chars = []
        for word in words[:3]:
            for ch in word:
                if ch in consonants:
                    prefix_chars.append(ch)
                    break
            if len(prefix_chars) >= 3:
                break
        result = ''.join(prefix_chars)
        return result[:3] if len(result) >= 2 else title[:3].upper()

    @property
    def is_upcoming(self):
        return self.start_date > timezone.now()

    @property
    def is_past(self):
        return self.start_date < timezone.now()

    @property
    def is_voting_active(self):
        if not self.voting_enabled:
            return False
        now = timezone.now()
        if self.voting_start and now < self.voting_start:
            return False
        if self.voting_end and now > self.voting_end:
            return False
        return self.event_status == 'voting_open'

    @property
    def duration_display(self):
        if self.end_date:
            duration = self.end_date - self.start_date
            if duration.days > 0:
                return f"{duration.days} day{'s' if duration.days > 1 else ''}"
            else:
                hours = duration.seconds // 3600
                return f"{hours} hour{'s' if hours > 1 else ''}"
        return "TBD"


class EventInquiry(models.Model):
    """Model for event booking inquiries"""
    INQUIRY_TYPES = [
        ('booking', 'Event Booking'),
        ('appearance', 'Appearance Request'),
        ('partnership', 'Partnership Inquiry'),
        ('media', 'Media Inquiry'),
        ('general', 'General Inquiry'),
    ]

    name = models.CharField(max_length=200)
    organization = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )],
        blank=True
    )
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    event_title = models.CharField(max_length=200, blank=True)
    proposed_date = models.DateField(null=True, blank=True)
    proposed_time = models.TimeField(null=True, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    expected_attendees = models.PositiveIntegerField(null=True, blank=True)
    budget_range = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    special_requirements = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('new', 'New'),
            ('in_progress', 'In Progress'),
            ('responded', 'Responded'),
            ('closed', 'Closed'),
        ],
        default='new'
    )
    admin_notes = models.TextField(blank=True)
    response_sent = models.BooleanField(default=False)
    response_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Events - Inquiry"
        verbose_name_plural = "Events - Inquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.inquiry_type} ({self.created_at.strftime('%Y-%m-%d')})"


class EventCategory(models.Model):
    """Model for event categories and tags"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')
    icon = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Events - Category"
        verbose_name_plural = "Events - Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class EventSettings(models.Model):
    """Model for event-related settings"""
    site_title = models.CharField(max_length=200, default="Events")
    site_description = models.TextField(blank=True)
    hero_image = cloudinary.models.CloudinaryField('hero_image', folder='missculture/events/settings', blank=True, null=True)
    hero_title = models.CharField(max_length=200, blank=True)
    hero_subtitle = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_address = models.TextField(blank=True)
    inquiry_enabled = models.BooleanField(default=True)
    inquiry_email_notifications = models.BooleanField(default=True)
    auto_response_enabled = models.BooleanField(default=True)
    auto_response_subject = models.CharField(max_length=200, default="Thank you for your inquiry")
    auto_response_message = models.TextField(blank=True)
    events_per_page = models.PositiveIntegerField(default=12)
    show_past_events = models.BooleanField(default=True)
    enable_calendar_view = models.BooleanField(default=True)
    enable_map_view = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Event Settings"
        verbose_name_plural = "Event Settings"

    def __str__(self):
        return "Event Settings"

    def save(self, *args, **kwargs):
        if not self.pk and EventSettings.objects.exists():
            return
        super().save(*args, **kwargs)


class TicketCategory(models.Model):
    """Model for flexible ticket categories per event (e.g. VIP, Couple, At the Gate)"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_categories')
    name = models.CharField(max_length=100, help_text="E.g. VIP, Single, Couple, At the Gate, Early Bird")
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in KES. Use 0 for free tickets.")
    description = models.CharField(max_length=200, blank=True, help_text="Brief description of what this ticket includes")
    available = models.PositiveIntegerField(default=0, help_text="Number of tickets currently available")
    total = models.PositiveIntegerField(default=0, help_text="Total tickets in this category")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower = shown first)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Events - Ticket Category"
        verbose_name_plural = "Events - Ticket Categories"
        ordering = ['order', 'price']

    def __str__(self):
        return f"{self.event.title} – {self.name}"


class Contestant(models.Model):
    """Model for voting contestants within an event"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='contestants')
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    photo = cloudinary.models.CloudinaryField('photo', folder='missculture/contestants', blank=True, null=True)
    contestant_number = models.PositiveIntegerField(help_text="Display number shown to voters")
    slug = models.SlugField(help_text="URL-friendly identifier for public page")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Events - Contestant"
        verbose_name_plural = "Events - Contestants"
        ordering = ['contestant_number']
        unique_together = [('event', 'slug'), ('event', 'contestant_number')]

    def __str__(self):
        return f"{self.name} (#{self.contestant_number}) – {self.event.title}"


class Payment(models.Model):
    """Model for M-Pesa payment tracking"""
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('reversed', 'Reversed'),
    ]
    PAYMENT_TYPE_CHOICES = [
        ('ticket', 'Ticket'),
        ('vote', 'Vote'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='payments')
    phone_number = models.CharField(max_length=20)
    mpesa_code = models.CharField(max_length=20, unique=True, null=True, blank=True, help_text="M-Pesa transaction code (must be unique). Leave blank for pending payments.")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE_CHOICES)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, help_text="Admin who verified this payment")
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Events - Payment"
        verbose_name_plural = "Events - Payments"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.mpesa_code} – {self.amount} KES ({self.status})"


class Ticket(models.Model):
    """Model for event tickets with structured unique codes"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    ticket_category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    ticket_code = models.CharField(max_length=20, unique=True, help_text="Format: PREFIX-RAND4#YY (e.g. FOS-WER3#26)")
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    is_used = models.BooleanField(default=False, help_text="Scanned at gate")
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Events - Ticket"
        verbose_name_plural = "Events - Tickets"
        ordering = ['-issued_at']

    def __str__(self):
        return f"{self.ticket_code} – {self.full_name}"


class VoteTransaction(models.Model):
    """Model for vote transactions — immutable, never deletable"""
    VOTE_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('reversed', 'Reversed'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='vote_transactions')
    contestant = models.ForeignKey(Contestant, on_delete=models.CASCADE, related_name='vote_transactions')
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='vote_transactions')
    vote_count = models.PositiveIntegerField(help_text="Calculated: payment amount / vote_price (backend-only)")
    phone_number = models.CharField(max_length=20)
    mpesa_code = models.CharField(max_length=20, blank=True, help_text="M-Pesa transaction code")
    status = models.CharField(max_length=20, choices=VOTE_STATUS_CHOICES, default='pending')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Events - Vote Transaction"
        verbose_name_plural = "Events - Vote Transactions"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.vote_count} votes for {self.contestant.name} – {self.status}"


class AuditLog(models.Model):
    """Immutable audit log for all administrative actions"""
    ACTION_CHOICES = [
        ('vote_reversal', 'Vote Reversal'),
        ('contestant_edit', 'Contestant Edit'),
        ('event_setting_change', 'Event Setting Change'),
        ('payment_adjustment', 'Payment Adjustment'),
        ('payment_verified', 'Payment Verified'),
        ('ticket_issued', 'Ticket Issued'),
        ('admin_action', 'Admin Action'),
    ]

    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    actor = models.CharField(max_length=150, help_text="Admin username or 'system'")
    details = models.TextField(help_text="JSON-serializable description of the action")
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Events - Audit Log"
        verbose_name_plural = "Events - Audit Logs"
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.action}] by {self.actor} at {self.created_at}"
