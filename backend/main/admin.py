from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from .models import (
    Ambassador, CulturalCommunity, CulturalHeritage, KenyaRegion,
    Achievement, Partner, SocialMediaPost, KenyaGalleryPhoto, SiteSettings
)


class KenyaGalleryPhotoInline(GenericTabularInline):
    model = KenyaGalleryPhoto
    extra = 3
    max_num = 10
    fields = ['image', 'caption', 'order']
    ct_field = 'content_type'
    ct_fk_field = 'object_id'


@admin.register(Ambassador)
class AmbassadorAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CulturalCommunity)
class CulturalCommunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'featured', 'created_at']
    list_filter = ['region', 'featured', 'created_at']
    search_fields = ['name', 'region', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(CulturalHeritage)
class CulturalHeritageAdmin(admin.ModelAdmin):
    list_display = ['title', 'heritage_type', 'featured', 'created_at']
    list_filter = ['heritage_type', 'featured', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(KenyaRegion)
class KenyaRegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'featured', 'created_at']
    list_filter = ['featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'achievement_type', 'year', 'featured', 'created_at']
    list_filter = ['achievement_type', 'year', 'featured', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(KenyaGalleryPhoto)
class KenyaGalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'content_type', 'object_id', 'order', 'created_at']
    list_filter = ['content_type', 'created_at']
    raw_id_fields = ['content_type']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'partner_type', 'featured', 'created_at']
    list_filter = ['partner_type', 'featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['featured']


@admin.register(SocialMediaPost)
class SocialMediaPostAdmin(admin.ModelAdmin):
    list_display = ['platform', 'created_at', 'featured', 'imported_at']
    list_filter = ['platform', 'featured', 'created_at', 'imported_at']
    search_fields = ['content', 'post_id']
    list_editable = ['featured']
    readonly_fields = ['imported_at']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Site-wide media settings — organized by page for easy management"""
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Home Page', {
            'fields': (
                'home_hero_image', 'home_hero_video_url', 
                'home_upcoming_event_image', 'home_kenya_highlight_image', 
                'home_ambassador_highlight_image'
            )
        }),
        ('Kenya Page', {
            'fields': (
                'kenya_hero_image', 
                'kenya_artisan_1_image', 'kenya_artisan_2_image', 
                'kenya_artisan_3_image', 'kenya_artisan_4_image'
            )
        }),
        ('Ambassador Page', {
            'fields': (
                'ambassador_hero_image', 'ambassador_profile_image', 'ambassador_video_url'
            )
        }),
        ('Events & Gallery', {
            'fields': ('events_hero_image', 'gallery_hero_image')
        }),
        ('Voting Page', {
            'fields': (
                'voting_hero_image', 
                'voting_event_1_image', 'voting_event_2_image', 
                'voting_event_3_image', 'voting_event_4_image',
                'voting_participant_1_image', 'voting_participant_2_image', 
                'voting_participant_3_image', 'voting_participant_4_image',
                'voting_participant_5_image', 'voting_participant_6_image'
            )
        }),
        ('About Page', {
            'fields': (
                'about_hero_image', 'about_mission_image', 
                'about_leader_1_image', 'about_leader_2_image', 'about_leader_3_image'
            )
        }),
        ('Other Pages', {
            'fields': (
                'partnership_hero_image', 'contribute_hero_image', 
                'contact_hero_image', 'faq_hero_image', 'privacy_hero_image'
            )
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()