from rest_framework import serializers
from .models import PhotoCollection, Photo, Video, GallerySettings
import cloudinary


class PhotoCollectionSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return str(obj.cover_image)
        return None

    class Meta:
        model = PhotoCollection
        fields = '__all__'


class PhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            return str(obj.image)
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return str(obj.thumbnail)
        # Auto-generate a Cloudinary thumbnail transform from the main image
        if obj.image:
            return str(cloudinary.CloudinaryResource(str(obj.image), default_resource_type='image').build_url(transformation=[{'width': 400, 'height': 300, 'crop': 'fill'}]))
        return None

    class Meta:
        model = Photo
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_video_url(self, obj):
        if obj.video_file:
            return str(obj.video_file)
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return str(obj.thumbnail)
        # Auto-generate a thumbnail from the video using Cloudinary
        if obj.video_file:
            return str(cloudinary.CloudinaryResource(str(obj.video_file), default_resource_type='video').build_url(transformation=[{'width': 400, 'height': 300, 'crop': 'fill', 'start_offset': '2'}], resource_type='video'))
        return None

    class Meta:
        model = Video
        fields = '__all__'


class GallerySettingsSerializer(serializers.ModelSerializer):
    hero_image_url = serializers.SerializerMethodField()

    def get_hero_image_url(self, obj):
        if obj.hero_image:
            return str(obj.hero_image)
        return None

    class Meta:
        model = GallerySettings
        fields = '__all__'
