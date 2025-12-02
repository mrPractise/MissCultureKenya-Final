from django.db import models
from django.utils import timezone


class Ambassador(models.Model):
    """Model for Susan's ambassador profile"""
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    mission_statement = models.TextField()
    profile_image = models.ImageField(upload_to='ambassador/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Ambassador"
        verbose_name_plural = "Ambassador"

    def __str__(self):
        return self.name


class CulturalCommunity(models.Model):
    """Model for different Kenyan cultural communities"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    region = models.CharField(max_length=100)
    image = models.ImageField(upload_to='communities/')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Our Culture - Community"
        verbose_name_plural = "Our Culture - Communities"

    def __str__(self):
        return self.name


class CulturalHeritage(models.Model):
    """Model for cultural heritage items"""
    HERITAGE_TYPES = [
        ('language', 'Language'),
        ('ceremony', 'Ceremony'),
        ('dance', 'Dance'),
        ('music', 'Music'),
        ('art', 'Art'),
        ('craft', 'Craft'),
    ]
    
    title = models.CharField(max_length=200)
    heritage_type = models.CharField(max_length=20, choices=HERITAGE_TYPES)
    description = models.TextField()
    image = models.ImageField(upload_to='heritage/', null=True, blank=True)
    audio_clip = models.FileField(upload_to='audio/', null=True, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Our Culture - Heritage Site"
        verbose_name_plural = "Our Culture - Heritage Sites"

    def __str__(self):
        return self.title


class KenyaRegion(models.Model):
    """Model for different regions of Kenya"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='regions/')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Our Kenya - Region"
        verbose_name_plural = "Our Kenya - Regions"

    def __str__(self):
        return self.name


class Achievement(models.Model):
    """Model for Kenya's global achievements"""
    ACHIEVEMENT_TYPES = [
        ('sports', 'Sports'),
        ('technology', 'Technology'),
        ('arts', 'Arts'),
        ('tourism', 'Tourism'),
        ('innovation', 'Innovation'),
    ]
    
    title = models.CharField(max_length=200)
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    description = models.TextField()
    image = models.ImageField(upload_to='achievements/')
    year = models.IntegerField()
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Global Stage - Achievement"
        verbose_name_plural = "Global Stage - Achievements"

    def __str__(self):
        return self.title


class BlogPost(models.Model):
    """Model for Susan's blog posts and journal entries"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=300)
    featured_image = models.ImageField(upload_to='blog/')
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Blog - Latest Insights"
        verbose_name_plural = "Blog - Latest Insights"
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class Partner(models.Model):
    """Model for partners and sponsors"""
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='partners/')
    website_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    partner_type = models.CharField(max_length=50, choices=[
        ('sponsor', 'Sponsor'),
        ('partner', 'Partner'),
        ('supporter', 'Supporter'),
    ])
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Partnership - Partner/Sponsor"
        verbose_name_plural = "Partnership - Partners/Sponsors"

    def __str__(self):
        return self.name


class SocialMediaPost(models.Model):
    """Model for social media integration"""
    platform = models.CharField(max_length=50, choices=[
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('tiktok', 'TikTok'),
    ])
    post_id = models.CharField(max_length=100)
    content = models.TextField()
    image_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    post_url = models.URLField()
    created_at = models.DateTimeField()
    featured = models.BooleanField(default=False)
    imported_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Social Media Post"
        verbose_name_plural = "Social Media Posts"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.platform} - {self.created_at.strftime('%Y-%m-%d')}"