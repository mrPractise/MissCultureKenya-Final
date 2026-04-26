from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import PhotoCollection, Photo, Video, GallerySettings
from .serializers import (
    PhotoCollectionSerializer, PhotoSerializer, VideoSerializer, GallerySettingsSerializer
)


class PhotoCollectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PhotoCollection.objects.all()
    serializer_class = PhotoCollectionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']


class PhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Photo.objects.filter(published=True)
    serializer_class = PhotoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured', 'collection']
    search_fields = ['title', 'description', 'photographer', 'location']
    ordering_fields = ['title', 'created_at', 'date_taken']
    ordering = ['-created_at']


class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.filter(published=True)
    serializer_class = VideoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured', 'collection']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at']
    ordering = ['-created_at']


class GallerySettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GallerySettings.objects.all()
    serializer_class = GallerySettingsSerializer