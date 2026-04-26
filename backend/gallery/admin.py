from django.contrib import admin
from .models import PhotoCollection, Photo, Video, GallerySettings


@admin.register(PhotoCollection)
class PhotoCollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'featured', 'created_at']
    list_filter = ['featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['featured']


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'collection', 'featured', 'published', 'created_at']
    list_filter = ['category', 'featured', 'published', 'created_at', 'collection']
    search_fields = ['title', 'description', 'photographer', 'location']
    list_editable = ['featured', 'published']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'collection', 'featured', 'published', 'created_at']
    list_filter = ['category', 'featured', 'published', 'created_at', 'collection']
    search_fields = ['title', 'description']
    list_editable = ['featured', 'published']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(GallerySettings)
class GallerySettingsAdmin(admin.ModelAdmin):
    list_display = ['site_title', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        return not GallerySettings.objects.exists()