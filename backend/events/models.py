from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator


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

    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    
    # Date and time
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_all_day = models.BooleanField(default=False)
    
    # Location
    venue_name = models.CharField(max_length=200)
    venue_address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Kenya')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    
    # Media
    featured_image = models.ImageField(upload_to='events/', null=True, blank=True)
    gallery = models.ManyToManyField('gallery.Photo', blank=True, related_name='events')
    
    # Additional info
    capacity = models.PositiveIntegerField(null=True, blank=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ticket_url = models.URLField(blank=True)
    registration_required = models.BooleanField(default=False)
    registration_url = models.URLField(blank=True)
    
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

    @property
    def is_upcoming(self):
        return self.start_date > timezone.now()

    @property
    def is_past(self):
        return self.start_date < timezone.now()

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

    # Contact Information
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
    
    # Inquiry Details
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES)
    event_title = models.CharField(max_length=200, blank=True)
    proposed_date = models.DateField(null=True, blank=True)
    proposed_time = models.TimeField(null=True, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    expected_attendees = models.PositiveIntegerField(null=True, blank=True)
    budget_range = models.CharField(max_length=100, blank=True)
    
    # Message
    message = models.TextField()
    special_requirements = models.TextField(blank=True)
    
    # Status and Response
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
    
    # Timestamps
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
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    icon = models.CharField(max_length=50, blank=True)  # Icon class name
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
    hero_image = models.ImageField(upload_to='events/settings/', null=True, blank=True)
    hero_title = models.CharField(max_length=200, blank=True)
    hero_subtitle = models.TextField(blank=True)
    
    # Contact Information
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_address = models.TextField(blank=True)
    
    # Inquiry Settings
    inquiry_enabled = models.BooleanField(default=True)
    inquiry_email_notifications = models.BooleanField(default=True)
    auto_response_enabled = models.BooleanField(default=True)
    auto_response_subject = models.CharField(max_length=200, default="Thank you for your inquiry")
    auto_response_message = models.TextField(blank=True)
    
    # Display Settings
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
        # Ensure only one settings instance exists
        if not self.pk and EventSettings.objects.exists():
            return
        super().save(*args, **kwargs)