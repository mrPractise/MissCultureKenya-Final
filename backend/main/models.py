from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
import cloudinary.models


class Ambassador(models.Model):
    """Model for Susan's ambassador profile"""
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    mission_statement = models.TextField()
    profile_image = cloudinary.models.CloudinaryField('profile_image', folder='missculture/ambassador', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Ambassador"
        verbose_name_plural = "Ambassador"

    def __str__(self):
        return self.name


class KenyaGalleryPhoto(models.Model):
    """Gallery photos for Kenya sections (regions, communities, heritage, achievements)"""
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    image = cloudinary.models.CloudinaryField('image', folder='missculture/kenya-gallery', blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kenya Gallery Photo"
        verbose_name_plural = "Kenya Gallery Photos"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"Photo for {self.content_type.model} #{self.object_id}"


class CulturalCommunity(models.Model):
    """Model for different Kenyan cultural communities"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    region = models.CharField(max_length=100)
    image = cloudinary.models.CloudinaryField('image', folder='missculture/communities', blank=True, null=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    gallery = GenericRelation(KenyaGalleryPhoto)

    class Meta:
        verbose_name = "Kenya - Community"
        verbose_name_plural = "Kenya - Communities"

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
    image = cloudinary.models.CloudinaryField('image', folder='missculture/heritage', blank=True, null=True)
    audio_clip = cloudinary.models.CloudinaryField('audio_clip', folder='missculture/audio', resource_type='video', blank=True, null=True)
    video_clip = cloudinary.models.CloudinaryField('video_clip', folder='missculture/heritage-video', resource_type='video', blank=True, null=True)
    video_url = models.URLField('video_url', blank=True, help_text="External video link (YouTube, etc.) — overrides uploaded video clip")
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    gallery = GenericRelation(KenyaGalleryPhoto)

    class Meta:
        verbose_name = "Kenya - Heritage"
        verbose_name_plural = "Kenya - Heritage"

    def __str__(self):
        return self.title


class KenyaRegion(models.Model):
    """Model for different regions of Kenya"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = cloudinary.models.CloudinaryField('image', folder='missculture/regions', blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    gallery = GenericRelation(KenyaGalleryPhoto)

    class Meta:
        verbose_name = "Kenya - Region"
        verbose_name_plural = "Kenya - Regions"

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
    image = cloudinary.models.CloudinaryField('image', folder='missculture/achievements', blank=True, null=True)
    year = models.IntegerField()
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    gallery = GenericRelation(KenyaGalleryPhoto)

    class Meta:
        verbose_name = "Kenya - Achievement"
        verbose_name_plural = "Kenya - Achievements"

    def __str__(self):
        return self.title


class Partner(models.Model):
    """Model for partners and sponsors"""
    name = models.CharField(max_length=200)
    logo = cloudinary.models.CloudinaryField('logo', folder='missculture/partners', blank=True, null=True)
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


class TeamMember(models.Model):
    """Model for leadership team members displayed on the About page"""
    TEAM_TYPE = [
        ('leadership', 'Leadership'),
        ('committee', 'Organizing Committee'),
    ]
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200, blank=True, help_text="Role or title (e.g. Miss Culture Global Kenya, Director of Operations)")
    role = models.CharField(max_length=200, blank=True, help_text="Committee role (only for committee members)")
    bio = models.TextField(blank=True)
    image = cloudinary.models.CloudinaryField('image', folder='missculture/team', blank=True, null=True)
    team_type = models.CharField(max_length=20, choices=TEAM_TYPE, default='leadership')
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower = shown first)")
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "About - Team Member"
        verbose_name_plural = "About - Team Members"
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_team_type_display()})"


class SiteSettings(models.Model):
    """Singleton model for site-wide hero images per navbar tab"""

    # ── Leader labels (editable from Django admin) ──
    leader_1_name = models.CharField(max_length=100, blank=True, default='')
    leader_1_title = models.CharField(max_length=200, blank=True, default='')
    leader_1_bio = models.TextField(blank=True, default='')
    leader_2_name = models.CharField(max_length=100, blank=True, default='')
    leader_2_title = models.CharField(max_length=200, blank=True, default='')
    leader_2_bio = models.TextField(blank=True, default='')
    leader_3_name = models.CharField(max_length=100, blank=True, default='')
    leader_3_title = models.CharField(max_length=200, blank=True, default='')
    leader_3_bio = models.TextField(blank=True, default='')

    # ── Committee labels (editable from Django admin) ──
    committee_1_name = models.CharField(max_length=100, blank=True, default='')
    committee_1_role = models.CharField(max_length=200, blank=True, default='')
    committee_1_bio = models.TextField(blank=True, default='')
    committee_2_name = models.CharField(max_length=100, blank=True, default='')
    committee_2_role = models.CharField(max_length=200, blank=True, default='')
    committee_2_bio = models.TextField(blank=True, default='')
    committee_3_name = models.CharField(max_length=100, blank=True, default='')
    committee_3_role = models.CharField(max_length=200, blank=True, default='')
    committee_3_bio = models.TextField(blank=True, default='')
    committee_4_name = models.CharField(max_length=100, blank=True, default='')
    committee_4_role = models.CharField(max_length=200, blank=True, default='')
    committee_4_bio = models.TextField(blank=True, default='')
    committee_5_name = models.CharField(max_length=100, blank=True, default='')
    committee_5_role = models.CharField(max_length=200, blank=True, default='')
    committee_5_bio = models.TextField(blank=True, default='')
    committee_6_name = models.CharField(max_length=100, blank=True, default='')
    committee_6_role = models.CharField(max_length=200, blank=True, default='')
    committee_6_bio = models.TextField(blank=True, default='')

    # ── Home tab ──
    home_hero_image = cloudinary.models.CloudinaryField('home_hero', folder='missculture/site/home', blank=True, null=True)
    home_hero_video_url = models.URLField('home_hero_video_url', blank=True, null=True)
    home_upcoming_event_image = cloudinary.models.CloudinaryField('home_upcoming_event', folder='missculture/site/home', blank=True, null=True)
    home_kenya_highlight_image = cloudinary.models.CloudinaryField('home_kenya_highlight', folder='missculture/site/home', blank=True, null=True)
    home_ambassador_highlight_image = cloudinary.models.CloudinaryField('home_ambassador_highlight', folder='missculture/site/home', blank=True, null=True)

    # ── Kenya tab ──
    kenya_hero_image = cloudinary.models.CloudinaryField('kenya_hero', folder='missculture/site/kenya', blank=True, null=True)
    kenya_artisan_1_image = cloudinary.models.CloudinaryField('kenya_artisan_1', folder='missculture/site/kenya', blank=True, null=True)
    kenya_artisan_2_image = cloudinary.models.CloudinaryField('kenya_artisan_2', folder='missculture/site/kenya', blank=True, null=True)
    kenya_artisan_3_image = cloudinary.models.CloudinaryField('kenya_artisan_3', folder='missculture/site/kenya', blank=True, null=True)
    kenya_artisan_4_image = cloudinary.models.CloudinaryField('kenya_artisan_4', folder='missculture/site/kenya', blank=True, null=True)

    # ── Ambassador tab ──
    ambassador_hero_image = cloudinary.models.CloudinaryField('ambassador_hero', folder='missculture/site/ambassador', blank=True, null=True)
    ambassador_profile_image = cloudinary.models.CloudinaryField('ambassador_profile', folder='missculture/site/ambassador', blank=True, null=True)
    ambassador_video_url = models.URLField('ambassador_video_url', blank=True, null=True)

    # ── Events tab (header only; EventSettings.hero_image also exists)
    events_hero_image = cloudinary.models.CloudinaryField('events_hero', folder='missculture/site/events', blank=True, null=True)

    # ── Gallery tab (header only; GallerySettings.hero_image also exists)
    gallery_hero_image = cloudinary.models.CloudinaryField('gallery_hero', folder='missculture/site/gallery', blank=True, null=True)

    # ── Voting tab ──
    voting_hero_image = cloudinary.models.CloudinaryField('voting_hero', folder='missculture/site/voting', blank=True, null=True)
    voting_event_1_image = cloudinary.models.CloudinaryField('voting_event_1', folder='missculture/site/voting', blank=True, null=True)
    voting_event_2_image = cloudinary.models.CloudinaryField('voting_event_2', folder='missculture/site/voting', blank=True, null=True)
    voting_event_3_image = cloudinary.models.CloudinaryField('voting_event_3', folder='missculture/site/voting', blank=True, null=True)
    voting_event_4_image = cloudinary.models.CloudinaryField('voting_event_4', folder='missculture/site/voting', blank=True, null=True)
    voting_participant_1_image = cloudinary.models.CloudinaryField('voting_participant_1', folder='missculture/site/voting', blank=True, null=True)
    voting_participant_2_image = cloudinary.models.CloudinaryField('voting_participant_2', folder='missculture/site/voting', blank=True, null=True)
    voting_participant_3_image = cloudinary.models.CloudinaryField('voting_participant_3', folder='missculture/site/voting', blank=True, null=True)
    voting_participant_4_image = cloudinary.models.CloudinaryField('voting_participant_4', folder='missculture/site/voting', blank=True, null=True)
    voting_participant_5_image = cloudinary.models.CloudinaryField('voting_participant_5', folder='missculture/site/voting', blank=True, null=True)
    voting_participant_6_image = cloudinary.models.CloudinaryField('voting_participant_6', folder='missculture/site/voting', blank=True, null=True)

    # ── Partnership tab ──
    partnership_hero_image = cloudinary.models.CloudinaryField('partnership_hero', folder='missculture/site/partnership', blank=True, null=True)

    # ── Contribute tab ──
    contribute_hero_image = cloudinary.models.CloudinaryField('contribute_hero', folder='missculture/site/contribute', blank=True, null=True)

    # ── Contact tab ──
    contact_hero_image = cloudinary.models.CloudinaryField('contact_hero', folder='missculture/site/contact', blank=True, null=True)

    # ── FAQ tab ──
    faq_hero_image = cloudinary.models.CloudinaryField('faq_hero', folder='missculture/site/faq', blank=True, null=True)

    # ── About tab ──
    about_hero_image = cloudinary.models.CloudinaryField('about_hero', folder='missculture/site/about', blank=True, null=True)
    about_mission_image = cloudinary.models.CloudinaryField('about_mission', folder='missculture/site/about', blank=True, null=True)
    about_leader_1_image = cloudinary.models.CloudinaryField('about_leader_1', folder='missculture/site/about', blank=True, null=True)
    about_leader_2_image = cloudinary.models.CloudinaryField('about_leader_2', folder='missculture/site/about', blank=True, null=True)
    about_leader_3_image = cloudinary.models.CloudinaryField('about_leader_3', folder='missculture/site/about', blank=True, null=True)

    # ── Privacy tab ──
    privacy_hero_image = cloudinary.models.CloudinaryField('privacy_hero', folder='missculture/site/privacy', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            return
        super().save(*args, **kwargs)


class SocialMediaPost(models.Model):
    """Model for social media integration"""
    platform = models.CharField(max_length=50, choices=[
        ('instagram', 'Instagram'),
        ('facebook', 'Facebook'),
        ('x', 'X'),
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