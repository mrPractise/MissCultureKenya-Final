from django.db import models
from django.utils import timezone


class PhotoCollection(models.Model):
    """Model for organizing photos into collections"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='collections/')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Gallery - Photo Collection"
        verbose_name_plural = "Gallery - Photo Collections"
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Photo(models.Model):
    """Model for individual photos in the gallery"""
    CATEGORIES = [
        ('official_photoshoot', 'Official Photoshoot'),
        ('cultural_event', 'Cultural Event'),
        ('behind_scenes', 'Behind the Scenes'),
        ('community_work', 'Community Work'),
        ('travel', 'Travel'),
        ('awards', 'Awards'),
        ('fashion', 'Fashion'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='gallery/')
    thumbnail = models.ImageField(upload_to='gallery/thumbnails/', null=True, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORIES)
    collection = models.ForeignKey(PhotoCollection, on_delete=models.SET_NULL, null=True, blank=True, related_name='photos')
    photographer = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    date_taken = models.DateField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Gallery - Photo"
        verbose_name_plural = "Gallery - Photos"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-generate thumbnail if not provided
        if not self.thumbnail and self.image:
            # This would typically use PIL to create a thumbnail
            # For now, we'll just use the same image
            self.thumbnail = self.image
        super().save(*args, **kwargs)


class Video(models.Model):
    """Model for videos in the gallery"""
    CATEGORIES = [
        ('official_photoshoot', 'Official Photoshoot'),
        ('cultural_event', 'Cultural Event'),
        ('behind_scenes', 'Behind the Scenes'),
        ('community_work', 'Community Work'),
        ('interview', 'Interview'),
        ('performance', 'Performance'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_file = models.FileField(upload_to='gallery/videos/')
    thumbnail = models.ImageField(upload_to='gallery/video_thumbnails/')
    category = models.CharField(max_length=30, choices=CATEGORIES)
    collection = models.ForeignKey(PhotoCollection, on_delete=models.SET_NULL, null=True, blank=True, related_name='videos')
    duration = models.DurationField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Gallery - Video"
        verbose_name_plural = "Gallery - Videos"
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class GallerySettings(models.Model):
    """Model for gallery-wide settings"""
    site_title = models.CharField(max_length=200, default="Gallery")
    site_description = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to='gallery/settings/', null=True, blank=True)
    hero_title = models.CharField(max_length=200, blank=True)
    hero_subtitle = models.TextField(blank=True)
    items_per_page = models.PositiveIntegerField(default=20)
    enable_lightbox = models.BooleanField(default=True)
    enable_social_sharing = models.BooleanField(default=True)
    enable_download = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Gallery Settings"
        verbose_name_plural = "Gallery Settings"

    def __str__(self):
        return "Gallery Settings"

    def save(self, *args, **kwargs):
        # Ensure only one settings instance exists
        if not self.pk and GallerySettings.objects.exists():
            return
        super().save(*args, **kwargs)