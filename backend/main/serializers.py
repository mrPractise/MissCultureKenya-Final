from rest_framework import serializers
import cloudinary
from .models import (
    Ambassador, CulturalCommunity, CulturalHeritage, KenyaRegion,
    Achievement, Partner, SocialMediaPost, KenyaGalleryPhoto, SiteSettings, TeamMember
)


def _cloudinary_url(field_value, resource_type='image'):
    """Build a full Cloudinary URL from a CloudinaryField value."""
    if not field_value:
        return None
    url = str(field_value)
    if url.startswith(('http://', 'https://')):
        return url
    return cloudinary.CloudinaryResource(url, default_resource_type=resource_type).build_url()


class KenyaGalleryPhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    class Meta:
        model = KenyaGalleryPhoto
        fields = ['id', 'image_url', 'caption', 'order']


class AmbassadorSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()

    def get_profile_image_url(self, obj):
        return _cloudinary_url(obj.profile_image)

    class Meta:
        model = Ambassador
        fields = '__all__'


class CulturalCommunitySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    class Meta:
        model = CulturalCommunity
        fields = '__all__'


class CulturalHeritageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    audio_clip_url = serializers.SerializerMethodField()
    video_clip_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    def get_audio_clip_url(self, obj):
        return _cloudinary_url(obj.audio_clip, resource_type='video')

    def get_video_clip_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return _cloudinary_url(obj.video_clip, resource_type='video')

    class Meta:
        model = CulturalHeritage
        fields = '__all__'


class KenyaRegionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    class Meta:
        model = KenyaRegion
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    class Meta:
        model = Achievement
        fields = '__all__'


class PartnerSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    def get_logo_url(self, obj):
        return _cloudinary_url(obj.logo)

    class Meta:
        model = Partner
        fields = '__all__'


class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    class Meta:
        model = TeamMember
        fields = '__all__'


class SocialMediaPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaPost
        fields = '__all__'


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for site-wide hero images per navbar tab"""
    home_hero_image_url = serializers.SerializerMethodField()
    home_hero_video_url = serializers.URLField(allow_blank=True, allow_null=True, required=False)
    home_upcoming_event_image_url = serializers.SerializerMethodField()
    home_kenya_highlight_image_url = serializers.SerializerMethodField()
    home_ambassador_highlight_image_url = serializers.SerializerMethodField()
    
    kenya_hero_image_url = serializers.SerializerMethodField()
    kenya_artisan_1_image_url = serializers.SerializerMethodField()
    kenya_artisan_2_image_url = serializers.SerializerMethodField()
    kenya_artisan_3_image_url = serializers.SerializerMethodField()
    kenya_artisan_4_image_url = serializers.SerializerMethodField()
    
    ambassador_hero_image_url = serializers.SerializerMethodField()
    ambassador_profile_image_url = serializers.SerializerMethodField()
    ambassador_video_url = serializers.URLField(allow_blank=True, allow_null=True, required=False)
    
    events_hero_image_url = serializers.SerializerMethodField()
    gallery_hero_image_url = serializers.SerializerMethodField()
    
    voting_hero_image_url = serializers.SerializerMethodField()
    voting_event_1_image_url = serializers.SerializerMethodField()
    voting_event_2_image_url = serializers.SerializerMethodField()
    voting_event_3_image_url = serializers.SerializerMethodField()
    voting_event_4_image_url = serializers.SerializerMethodField()
    voting_participant_1_image_url = serializers.SerializerMethodField()
    voting_participant_2_image_url = serializers.SerializerMethodField()
    voting_participant_3_image_url = serializers.SerializerMethodField()
    voting_participant_4_image_url = serializers.SerializerMethodField()
    voting_participant_5_image_url = serializers.SerializerMethodField()
    voting_participant_6_image_url = serializers.SerializerMethodField()
    
    partnership_hero_image_url = serializers.SerializerMethodField()
    contribute_hero_image_url = serializers.SerializerMethodField()
    contact_hero_image_url = serializers.SerializerMethodField()
    faq_hero_image_url = serializers.SerializerMethodField()
    
    about_hero_image_url = serializers.SerializerMethodField()
    about_mission_image_url = serializers.SerializerMethodField()
    about_leader_1_image_url = serializers.SerializerMethodField()
    about_leader_2_image_url = serializers.SerializerMethodField()
    about_leader_3_image_url = serializers.SerializerMethodField()

    # Leader labels
    leader_1_name = serializers.CharField(allow_blank=True, required=False)
    leader_1_title = serializers.CharField(allow_blank=True, required=False)
    leader_1_bio = serializers.CharField(allow_blank=True, required=False)
    leader_2_name = serializers.CharField(allow_blank=True, required=False)
    leader_2_title = serializers.CharField(allow_blank=True, required=False)
    leader_2_bio = serializers.CharField(allow_blank=True, required=False)
    leader_3_name = serializers.CharField(allow_blank=True, required=False)
    leader_3_title = serializers.CharField(allow_blank=True, required=False)
    leader_3_bio = serializers.CharField(allow_blank=True, required=False)

    # Committee labels
    committee_1_name = serializers.CharField(allow_blank=True, required=False)
    committee_1_role = serializers.CharField(allow_blank=True, required=False)
    committee_1_bio = serializers.CharField(allow_blank=True, required=False)
    committee_2_name = serializers.CharField(allow_blank=True, required=False)
    committee_2_role = serializers.CharField(allow_blank=True, required=False)
    committee_2_bio = serializers.CharField(allow_blank=True, required=False)
    committee_3_name = serializers.CharField(allow_blank=True, required=False)
    committee_3_role = serializers.CharField(allow_blank=True, required=False)
    committee_3_bio = serializers.CharField(allow_blank=True, required=False)
    committee_4_name = serializers.CharField(allow_blank=True, required=False)
    committee_4_role = serializers.CharField(allow_blank=True, required=False)
    committee_4_bio = serializers.CharField(allow_blank=True, required=False)
    committee_5_name = serializers.CharField(allow_blank=True, required=False)
    committee_5_role = serializers.CharField(allow_blank=True, required=False)
    committee_5_bio = serializers.CharField(allow_blank=True, required=False)
    committee_6_name = serializers.CharField(allow_blank=True, required=False)
    committee_6_role = serializers.CharField(allow_blank=True, required=False)
    committee_6_bio = serializers.CharField(allow_blank=True, required=False)
    
    privacy_hero_image_url = serializers.SerializerMethodField()

    def _hero_url(self, obj, field_name):
        return _cloudinary_url(getattr(obj, field_name, None))

    def get_home_hero_image_url(self, obj): return self._hero_url(obj, 'home_hero_image')
    def get_home_upcoming_event_image_url(self, obj): return self._hero_url(obj, 'home_upcoming_event_image')
    def get_home_kenya_highlight_image_url(self, obj): return self._hero_url(obj, 'home_kenya_highlight_image')
    def get_home_ambassador_highlight_image_url(self, obj): return self._hero_url(obj, 'home_ambassador_highlight_image')
    
    def get_kenya_hero_image_url(self, obj): return self._hero_url(obj, 'kenya_hero_image')
    def get_kenya_artisan_1_image_url(self, obj): return self._hero_url(obj, 'kenya_artisan_1_image')
    def get_kenya_artisan_2_image_url(self, obj): return self._hero_url(obj, 'kenya_artisan_2_image')
    def get_kenya_artisan_3_image_url(self, obj): return self._hero_url(obj, 'kenya_artisan_3_image')
    def get_kenya_artisan_4_image_url(self, obj): return self._hero_url(obj, 'kenya_artisan_4_image')
    
    def get_ambassador_hero_image_url(self, obj): return self._hero_url(obj, 'ambassador_hero_image')
    def get_ambassador_profile_image_url(self, obj): return self._hero_url(obj, 'ambassador_profile_image')
    
    def get_events_hero_image_url(self, obj): return self._hero_url(obj, 'events_hero_image')
    def get_gallery_hero_image_url(self, obj): return self._hero_url(obj, 'gallery_hero_image')
    
    def get_voting_hero_image_url(self, obj): return self._hero_url(obj, 'voting_hero_image')
    def get_voting_event_1_image_url(self, obj): return self._hero_url(obj, 'voting_event_1_image')
    def get_voting_event_2_image_url(self, obj): return self._hero_url(obj, 'voting_event_2_image')
    def get_voting_event_3_image_url(self, obj): return self._hero_url(obj, 'voting_event_3_image')
    def get_voting_event_4_image_url(self, obj): return self._hero_url(obj, 'voting_event_4_image')
    def get_voting_participant_1_image_url(self, obj): return self._hero_url(obj, 'voting_participant_1_image')
    def get_voting_participant_2_image_url(self, obj): return self._hero_url(obj, 'voting_participant_2_image')
    def get_voting_participant_3_image_url(self, obj): return self._hero_url(obj, 'voting_participant_3_image')
    def get_voting_participant_4_image_url(self, obj): return self._hero_url(obj, 'voting_participant_4_image')
    def get_voting_participant_5_image_url(self, obj): return self._hero_url(obj, 'voting_participant_5_image')
    def get_voting_participant_6_image_url(self, obj): return self._hero_url(obj, 'voting_participant_6_image')
    
    def get_partnership_hero_image_url(self, obj): return self._hero_url(obj, 'partnership_hero_image')
    def get_contribute_hero_image_url(self, obj): return self._hero_url(obj, 'contribute_hero_image')
    def get_contact_hero_image_url(self, obj): return self._hero_url(obj, 'contact_hero_image')
    def get_faq_hero_image_url(self, obj): return self._hero_url(obj, 'faq_hero_image')
    
    def get_about_hero_image_url(self, obj): return self._hero_url(obj, 'about_hero_image')
    def get_about_mission_image_url(self, obj): return self._hero_url(obj, 'about_mission_image')
    def get_about_leader_1_image_url(self, obj): return self._hero_url(obj, 'about_leader_1_image')
    def get_about_leader_2_image_url(self, obj): return self._hero_url(obj, 'about_leader_2_image')
    def get_about_leader_3_image_url(self, obj): return self._hero_url(obj, 'about_leader_3_image')
    
    def get_privacy_hero_image_url(self, obj): return self._hero_url(obj, 'privacy_hero_image')

    class Meta:
        model = SiteSettings
        fields = [
            'home_hero_image_url', 'home_hero_video_url', 'home_upcoming_event_image_url',
            'home_kenya_highlight_image_url', 'home_ambassador_highlight_image_url',
            'kenya_hero_image_url', 'kenya_artisan_1_image_url', 'kenya_artisan_2_image_url',
            'kenya_artisan_3_image_url', 'kenya_artisan_4_image_url',
            'ambassador_hero_image_url', 'ambassador_profile_image_url', 'ambassador_video_url',
            'events_hero_image_url', 'gallery_hero_image_url',
            'voting_hero_image_url', 'voting_event_1_image_url', 'voting_event_2_image_url',
            'voting_event_3_image_url', 'voting_event_4_image_url',
            'voting_participant_1_image_url', 'voting_participant_2_image_url',
            'voting_participant_3_image_url', 'voting_participant_4_image_url',
            'voting_participant_5_image_url', 'voting_participant_6_image_url',
            'partnership_hero_image_url', 'contribute_hero_image_url',
            'contact_hero_image_url', 'faq_hero_image_url',
            'about_hero_image_url', 'about_mission_image_url',
            'about_leader_1_image_url', 'about_leader_2_image_url', 'about_leader_3_image_url',
            'leader_1_name', 'leader_1_title', 'leader_1_bio',
            'leader_2_name', 'leader_2_title', 'leader_2_bio',
            'leader_3_name', 'leader_3_title', 'leader_3_bio',
            'committee_1_name', 'committee_1_role', 'committee_1_bio',
            'committee_2_name', 'committee_2_role', 'committee_2_bio',
            'committee_3_name', 'committee_3_role', 'committee_3_bio',
            'committee_4_name', 'committee_4_role', 'committee_4_bio',
            'committee_5_name', 'committee_5_role', 'committee_5_bio',
            'committee_6_name', 'committee_6_role', 'committee_6_bio',
            'privacy_hero_image_url',
        ]


class DiscoverKenyaSerializer(serializers.Serializer):
    regions = KenyaRegionSerializer(many=True)
    communities = CulturalCommunitySerializer(many=True)
    heritage = CulturalHeritageSerializer(many=True)
    achievements = AchievementSerializer(many=True)
