from rest_framework import serializers
from .models import (
    Ambassador, CulturalCommunity, CulturalHeritage, KenyaRegion,
    Achievement, Partner, SocialMediaPost, KenyaGalleryPhoto, SiteSettings
)


class KenyaGalleryPhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            url = str(obj.image)
            # CloudinaryField returns full URL; ImageField returns relative path
            if url and not url.startswith(('http://', 'https://')):
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return url
        return None

    class Meta:
        model = KenyaGalleryPhoto
        fields = ['id', 'image_url', 'caption', 'order']


class AmbassadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambassador
        fields = '__all__'


class CulturalCommunitySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        if obj.image:
            url = str(obj.image)
            if url and not url.startswith(('http://', 'https://')):
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return url
        return None

    class Meta:
        model = CulturalCommunity
        fields = '__all__'


class CulturalHeritageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        if obj.image:
            url = str(obj.image)
            if url and not url.startswith(('http://', 'https://')):
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return url
        return None

    class Meta:
        model = CulturalHeritage
        fields = '__all__'


class KenyaRegionSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        if obj.image:
            url = str(obj.image)
            if url and not url.startswith(('http://', 'https://')):
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return url
        return None

    class Meta:
        model = KenyaRegion
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_photos = KenyaGalleryPhotoSerializer(many=True, read_only=True, source='gallery')

    def get_image_url(self, obj):
        if obj.image:
            url = str(obj.image)
            if url and not url.startswith(('http://', 'https://')):
                request = self.context.get('request')
                return request.build_absolute_uri(url) if request else url
            return url
        return None

    class Meta:
        model = Achievement
        fields = '__all__'


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = '__all__'


class SocialMediaPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaPost
        fields = '__all__'


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Serializer for site-wide hero images per navbar tab"""
    home_hero_image_url = serializers.SerializerMethodField()
    kenya_hero_image_url = serializers.SerializerMethodField()
    ambassador_hero_image_url = serializers.SerializerMethodField()
    events_hero_image_url = serializers.SerializerMethodField()
    gallery_hero_image_url = serializers.SerializerMethodField()
    voting_hero_image_url = serializers.SerializerMethodField()
    partnership_hero_image_url = serializers.SerializerMethodField()
    contribute_hero_image_url = serializers.SerializerMethodField()
    contact_hero_image_url = serializers.SerializerMethodField()
    faq_hero_image_url = serializers.SerializerMethodField()
    about_hero_image_url = serializers.SerializerMethodField()
    about_mission_image_url = serializers.SerializerMethodField()
    privacy_hero_image_url = serializers.SerializerMethodField()

    def _url(self, obj, field_name):
        val = getattr(obj, field_name, None)
        if val:
            return str(val)
        return None

    def get_home_hero_image_url(self, obj): return self._url(obj, 'home_hero_image')
    def get_kenya_hero_image_url(self, obj): return self._url(obj, 'kenya_hero_image')
    def get_ambassador_hero_image_url(self, obj): return self._url(obj, 'ambassador_hero_image')
    def get_events_hero_image_url(self, obj): return self._url(obj, 'events_hero_image')
    def get_gallery_hero_image_url(self, obj): return self._url(obj, 'gallery_hero_image')
    def get_voting_hero_image_url(self, obj): return self._url(obj, 'voting_hero_image')
    def get_partnership_hero_image_url(self, obj): return self._url(obj, 'partnership_hero_image')
    def get_contribute_hero_image_url(self, obj): return self._url(obj, 'contribute_hero_image')
    def get_contact_hero_image_url(self, obj): return self._url(obj, 'contact_hero_image')
    def get_faq_hero_image_url(self, obj): return self._url(obj, 'faq_hero_image')
    def get_about_hero_image_url(self, obj): return self._url(obj, 'about_hero_image')
    def get_about_mission_image_url(self, obj): return self._url(obj, 'about_mission_image')
    def get_privacy_hero_image_url(self, obj): return self._url(obj, 'privacy_hero_image')

    class Meta:
        model = SiteSettings
        fields = [
            'home_hero_image_url', 'kenya_hero_image_url',
            'ambassador_hero_image_url', 'events_hero_image_url',
            'gallery_hero_image_url', 'voting_hero_image_url',
            'partnership_hero_image_url', 'contribute_hero_image_url',
            'contact_hero_image_url', 'faq_hero_image_url',
            'about_hero_image_url', 'about_mission_image_url',
            'privacy_hero_image_url',
        ]


class DiscoverKenyaSerializer(serializers.Serializer):
    regions = KenyaRegionSerializer(many=True)
    communities = CulturalCommunitySerializer(many=True)
    heritage = CulturalHeritageSerializer(many=True)
    achievements = AchievementSerializer(many=True)
