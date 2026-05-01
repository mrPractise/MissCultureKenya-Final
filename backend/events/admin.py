from django.contrib import admin
from .models import Event, EventInquiry, EventCategory, EventSettings, TicketCategory


class TicketCategoryInline(admin.TabularInline):
    model = TicketCategory
    extra = 1
    fields = ['name', 'price', 'description', 'available', 'total', 'is_active', 'order']
    ordering = ['order', 'price']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'status', 'start_date', 'venue_name', 'featured', 'published']
    list_filter = ['event_type', 'status', 'featured', 'published', 'start_date', 'created_at']
    search_fields = ['title', 'description', 'venue_name', 'city']
    list_editable = ['featured', 'published']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_date'
    filter_horizontal = ['gallery']
    inlines = [TicketCategoryInline]


@admin.register(EventInquiry)
class EventInquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'inquiry_type', 'status', 'created_at']
    list_filter = ['inquiry_type', 'status', 'created_at']
    search_fields = ['name', 'organization', 'email', 'event_title']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at', 'response_date']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'organization', 'email', 'phone')
        }),
        ('Inquiry Details', {
            'fields': ('inquiry_type', 'event_title', 'proposed_date', 'proposed_time', 'venue', 'expected_attendees', 'budget_range')
        }),
        ('Message', {
            'fields': ('message', 'special_requirements')
        }),
        ('Response', {
            'fields': ('status', 'admin_notes', 'response_sent', 'response_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(EventSettings)
class EventSettingsAdmin(admin.ModelAdmin):
    list_display = ['site_title', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Site Information', {
            'fields': ('site_title', 'site_description', 'hero_image', 'hero_title', 'hero_subtitle')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'contact_address')
        }),
        ('Inquiry Settings', {
            'fields': ('inquiry_enabled', 'inquiry_email_notifications', 'auto_response_enabled', 'auto_response_subject', 'auto_response_message')
        }),
        ('Display Settings', {
            'fields': ('events_per_page', 'show_past_events', 'enable_calendar_view', 'enable_map_view')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        return not EventSettings.objects.exists()


@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'event', 'price', 'available', 'total', 'is_active', 'order']
    list_filter = ['is_active', 'event']
    list_editable = ['is_active', 'order']
    search_fields = ['name', 'event__title']
    ordering = ['event', 'order', 'price']