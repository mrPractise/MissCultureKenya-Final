from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PhotoCollectionViewSet, PhotoViewSet, VideoViewSet, GallerySettingsViewSet
)

router = DefaultRouter()
router.register(r'collections', PhotoCollectionViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'settings', GallerySettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
