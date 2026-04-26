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
    """Site-wide hero images — one section per navbar tab"""
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('🏠 Home', {
            'fields': ('home_hero_image',)
        }),
        ('🇰🇪 Kenya', {
            'fields': ('kenya_hero_image',)
        }),
        ('👩 Ambassador', {
            'fields': ('ambassador_hero_image',)
        }),
        ('📅 Events', {
            'fields': ('events_hero_image',)
        }),
        ('🖼️ Gallery', {
            'fields': ('gallery_hero_image',)
        }),
        ('🗳️ Voting', {
            'fields': ('voting_hero_image',)
        }),
        ('🤝 Partnership', {
            'fields': ('partnership_hero_image',)
        }),
        ('💛 Contribute', {
            'fields': ('contribute_hero_image',)
        }),
        ('📧 Contact', {
            'fields': ('contact_hero_image',)
        }),
        ('❓ FAQ', {
            'fields': ('faq_hero_image',)
        }),
        ('ℹ️ About', {
            'fields': ('about_hero_image', 'about_mission_image')
        }),
        ('🔒 Privacy', {
            'fields': ('privacy_hero_image',)
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()