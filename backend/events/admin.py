from django.contrib import admin
from .models import (
    Event, EventInquiry, EventCategory, EventSettings,
    TicketCategory, Contestant, Payment, Ticket, VoteTransaction, AuditLog
)


# ── Inlines ──────────────────────────────────────────────────────────────────

class TicketCategoryInline(admin.TabularInline):
    model = TicketCategory
    extra = 1
    fields = ['name', 'price', 'description', 'available', 'total', 'is_active', 'order']
    ordering = ['order', 'price']


class ContestantInline(admin.TabularInline):
    model = Contestant
    extra = 1
    fields = ['contestant_number', 'name', 'slug', 'photo', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['contestant_number']


# ── Event Admin ──────────────────────────────────────────────────────────────

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'event_status', 'status', 'start_date', 'venue_name', 'voting_enabled', 'featured', 'published']
    list_filter = ['event_type', 'event_status', 'status', 'voting_enabled', 'featured', 'published', 'start_date', 'created_at']
    search_fields = ['title', 'description', 'venue_name', 'city']
    list_editable = ['featured', 'published', 'event_status']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'ticket_prefix']
    date_hierarchy = 'start_date'
    filter_horizontal = ['gallery']
    inlines = [TicketCategoryInline, ContestantInline]

    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'slug', 'description', 'event_type', 'event_status', 'status')
        }),
        ('Date & Time', {
            'fields': ('start_date', 'end_date', 'is_all_day')
        }),
        ('Location', {
            'fields': ('venue_name', 'venue_address', 'city', 'country', 'latitude', 'longitude')
        }),
        ('Media', {
            'fields': ('featured_image', 'gallery')
        }),
        ('Ticketing', {
            'fields': ('capacity', 'ticket_price', 'ticket_url', 'registration_required', 'registration_url', 'ticket_prefix')
        }),
        ('Voting Configuration', {
            'fields': ('voting_enabled', 'vote_price', 'voting_start', 'voting_end', 'result_visibility'),
            'classes': ('collapse',),
            'description': 'Configure voting for this event. Set event_status to "voting_open" to allow voting.'
        }),
        ('Payment Configuration', {
            'fields': ('payment_method', 'paybill_number', 'till_number', 'account_number', 'account_name'),
            'classes': ('collapse',),
        }),
        ('SEO & Visibility', {
            'fields': ('featured', 'published', 'meta_description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        # Auto-derive ticket_prefix on save
        if not obj.ticket_prefix and obj.title:
            obj.ticket_prefix = obj._derive_prefix(obj.title)
        super().save_model(request, obj, form, change)


# ── EventInquiry Admin ───────────────────────────────────────────────────────

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


# ── EventCategory Admin ──────────────────────────────────────────────────────

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


# ── EventSettings Admin ──────────────────────────────────────────────────────

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
        return not EventSettings.objects.exists()


# ── TicketCategory Admin ─────────────────────────────────────────────────────

@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'event', 'price', 'available', 'total', 'is_active', 'order']
    list_filter = ['is_active', 'event']
    list_editable = ['is_active', 'order']
    search_fields = ['name', 'event__title']
    ordering = ['event', 'order', 'price']


# ── Contestant Admin ─────────────────────────────────────────────────────────

@admin.register(Contestant)
class ContestantAdmin(admin.ModelAdmin):
    list_display = ['contestant_number', 'name', 'event', 'is_active', 'created_at']
    list_filter = ['is_active', 'event', 'created_at']
    list_editable = ['is_active']
    search_fields = ['name', 'event__title']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['event', 'contestant_number']

    def save_model(self, request, obj, form, change):
        if change:
            # Audit log for contestant edits
            AuditLog.objects.create(
                action='contestant_edit',
                actor=request.user.username,
                details=f"Edited contestant #{obj.contestant_number} '{obj.name}' in event '{obj.event.title}'",
                event=obj.event,
            )
        super().save_model(request, obj, form, change)


# ── Payment Admin ────────────────────────────────────────────────────────────

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['mpesa_code', 'event', 'phone_number', 'amount', 'payment_type', 'status', 'verified_by', 'created_at']
    list_filter = ['status', 'payment_type', 'event', 'created_at']
    search_fields = ['mpesa_code', 'phone_number']
    readonly_fields = ['created_at', 'updated_at', 'verified_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    actions = ['mark_successful', 'mark_failed', 'mark_reversed']

    @admin.action(description='Mark selected payments as successful')
    def mark_successful(self, request, queryset):
        updated = 0
        for payment in queryset.filter(status='pending'):
            payment.status = 'successful'
            payment.verified_by = request.user
            payment.verified_at = timezone.now()
            payment.save()
            AuditLog.objects.create(
                action='payment_verified',
                actor=request.user.username,
                details=f"Admin marked payment {payment.mpesa_code} (KES {payment.amount}) as successful",
                event=payment.event,
            )
            updated += 1
        self.message_user(request, f'{updated} payment(s) marked as successful.')

    @admin.action(description='Mark selected payments as failed')
    def mark_failed(self, request, queryset):
        updated = queryset.filter(status='pending').update(status='failed')
        self.message_user(request, f'{updated} payment(s) marked as failed.')

    @admin.action(description='Mark selected payments as reversed')
    def mark_reversed(self, request, queryset):
        updated = 0
        for payment in queryset.exclude(status='reversed'):
            payment.status = 'reversed'
            payment.save()
            # Reverse associated votes
            VoteTransaction.objects.filter(payment=payment).update(status='reversed')
            AuditLog.objects.create(
                action='payment_adjustment',
                actor=request.user.username,
                details=f"Reversed payment {payment.mpesa_code} (KES {payment.amount})",
                event=payment.event,
            )
            updated += 1
        self.message_user(request, f'{updated} payment(s) marked as reversed.')


# ── Ticket Admin ─────────────────────────────────────────────────────────────

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_code', 'full_name', 'event', 'ticket_category', 'is_used', 'issued_at']
    list_filter = ['event', 'ticket_category', 'is_used', 'issued_at']
    search_fields = ['ticket_code', 'full_name', 'email', 'phone']
    readonly_fields = ['ticket_code', 'issued_at']
    ordering = ['-issued_at']
    date_hierarchy = 'issued_at'

    def has_delete_permission(self, request, obj=None):
        return False  # Tickets should never be deleted


# ── VoteTransaction Admin ────────────────────────────────────────────────────

@admin.register(VoteTransaction)
class VoteTransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'contestant', 'event', 'vote_count', 'phone_number', 'mpesa_code', 'status', 'created_at']
    list_filter = ['status', 'event', 'contestant', 'created_at']
    search_fields = ['mpesa_code', 'phone_number', 'contestant__name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    def has_delete_permission(self, request, obj=None):
        return False  # Vote transactions are immutable

    def has_add_permission(self, request):
        return False  # Votes are only created through payment processing


# ── AuditLog Admin ───────────────────────────────────────────────────────────

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'actor', 'event', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['actor', 'details']
    readonly_fields = ['action', 'actor', 'details', 'event', 'created_at']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


# ── Timezone import for PaymentAdmin actions ─────────────────────────────────

from django.utils import timezone
