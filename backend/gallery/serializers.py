from rest_framework import serializers
from .models import PhotoCollection, Photo, Video, GallerySettings
import cloudinary


def _cloudinary_url(field_value, resource_type='image'):
    """Build a full Cloudinary URL from a CloudinaryField value."""
    if not field_value:
        return None
    url = str(field_value)
    # If it's already a full URL, return as-is
    if url.startswith(('http://', 'https://')):
        return url
    # Build the Cloudinary CDN URL
    return cloudinary.CloudinaryResource(url, default_resource_type=resource_type).build_url()


class PhotoCollectionSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    def get_cover_image_url(self, obj):
        return _cloudinary_url(obj.cover_image)

    class Meta:
        model = PhotoCollection
        fields = '__all__'


class PhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return _cloudinary_url(obj.image)

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return _cloudinary_url(obj.thumbnail)
        # Auto-generate a Cloudinary thumbnail transform from the main image
        if obj.image:
            return cloudinary.CloudinaryResource(
                str(obj.image), default_resource_type='image'
            ).build_url(transformation=[{'width': 400, 'height': 300, 'crop': 'fill'}])
        return None

    class Meta:
        model = Photo
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    video_file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_video_url(self, obj):
        # Prioritize external URL (YouTube etc.) over uploaded file
        if obj.video_url:
            return obj.video_url
        return _cloudinary_url(obj.video_file, resource_type='video')

    def get_video_file_url(self, obj):
        return _cloudinary_url(obj.video_file, resource_type='video')

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return _cloudinary_url(obj.thumbnail)
        # Auto-generate a thumbnail from the video using Cloudinary
        if obj.video_file:
            return cloudinary.CloudinaryResource(
                str(obj.video_file), default_resource_type='video'
            ).build_url(
                transformation=[{'width': 400, 'height': 300, 'crop': 'fill', 'start_offset': '2'}],
                resource_type='video'
            )
        return None

    class Meta:
        model = Video
        fields = '__all__'


class GallerySettingsSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()

    def get_hero_image_url(self, obj):
        return _cloudinary_url(obj.hero_image)

    class Meta:
        model = GallerySettings
        fields = '__all__'
