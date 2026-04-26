from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AmbassadorViewSet, CulturalCommunityViewSet, CulturalHeritageViewSet,
    KenyaRegionViewSet, AchievementViewSet,
    PartnerViewSet, SocialMediaPostViewSet, DiscoverKenyaAPIView,
    SiteSettingsAPIView, contact_message
)

router = DefaultRouter()
router.register(r'ambassador', AmbassadorViewSet)
router.register(r'communities', CulturalCommunityViewSet)
router.register(r'heritage', CulturalHeritageViewSet)
router.register(r'regions', KenyaRegionViewSet)
router.register(r'achievements', AchievementViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'social-media', SocialMediaPostViewSet)

urlpatterns = [
    path('settings/', SiteSettingsAPIView.as_view(), name='site-settings'),
    path('discover/', DiscoverKenyaAPIView.as_view(), name='discover-kenya'),
    path('contact/', contact_message, name='contact-message'),
    path('', include(router.urls)),
]
