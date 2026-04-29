from rest_framework import serializers
from .models import Event, EventInquiry, EventCategory, EventSettings
import cloudinary


def _cloudinary_url(field_value, resource_type='image'):
    if not field_value:
        return None
    url = str(field_value)
    if url.startswith(('http://', 'https://')):
        return url
    return cloudinary.CloudinaryResource(url, default_resource_type=resource_type).build_url()


class EventSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()

    def get_featured_image_url(self, obj):
        return _cloudinary_url(obj.featured_image)

    class Meta:
        model = Event
        fields = '__all__'


class EventInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInquiry
        fields = '__all__'


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'


class EventSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSettings
        fields = '__all__'
