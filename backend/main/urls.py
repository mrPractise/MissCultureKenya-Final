from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AmbassadorViewSet, CulturalCommunityViewSet, CulturalHeritageViewSet,
    KenyaRegionViewSet, AchievementViewSet,
    PartnerViewSet, SocialMediaPostViewSet, DiscoverKenyaAPIView,
    SiteSettingsAPIView, contact_message, TeamMemberViewSet, check_email_connection,
    generate_test_pdf_view,
    HomePageSettingsAPIView, KenyaPageSettingsAPIView, AmbassadorPageSettingsAPIView,
    EventsPageSettingsAPIView, GalleryPageSettingsAPIView, PartnershipPageSettingsAPIView,
    AboutPageSettingsAPIView,
    VotingPageSettingsAPIView, ContactPageSettingsAPIView, FAQPageSettingsAPIView,
    ContributePageSettingsAPIView, PrivacyPageSettingsAPIView, TermsPageSettingsAPIView
)

router = DefaultRouter()
router.register(r'ambassador', AmbassadorViewSet)
router.register(r'communities', CulturalCommunityViewSet)
router.register(r'heritage', CulturalHeritageViewSet)
router.register(r'regions', KenyaRegionViewSet)
router.register(r'achievements', AchievementViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'social-media', SocialMediaPostViewSet)
router.register(r'team', TeamMemberViewSet)

urlpatterns = [
    path('settings/', SiteSettingsAPIView.as_view(), name='site-settings'),
    path('discover/', DiscoverKenyaAPIView.as_view(), name='discover-kenya'),
    path('contact/', contact_message, name='contact-message'),
    path('email-check/', check_email_connection, name='email-check'),
    path('test-pdf/', generate_test_pdf_view, name='test-pdf'),
    # Page-specific settings APIs
    path('settings/home/', HomePageSettingsAPIView.as_view(), name='home-settings'),
    path('settings/kenya/', KenyaPageSettingsAPIView.as_view(), name='kenya-settings'),
    path('settings/ambassador/', AmbassadorPageSettingsAPIView.as_view(), name='ambassador-settings'),
    path('settings/events/', EventsPageSettingsAPIView.as_view(), name='events-settings'),
    path('settings/gallery/', GalleryPageSettingsAPIView.as_view(), name='gallery-settings'),
    path('settings/partnership/', PartnershipPageSettingsAPIView.as_view(), name='partnership-settings'),
    path('settings/about/', AboutPageSettingsAPIView.as_view(), name='about-settings'),
    path('settings/voting/', VotingPageSettingsAPIView.as_view(), name='voting-settings'),
    path('settings/contact/', ContactPageSettingsAPIView.as_view(), name='contact-settings'),
    path('settings/faq/', FAQPageSettingsAPIView.as_view(), name='faq-settings'),
    path('settings/contribute/', ContributePageSettingsAPIView.as_view(), name='contribute-settings'),
    path('settings/privacy/', PrivacyPageSettingsAPIView.as_view(), name='privacy-settings'),
    path('settings/terms/', TermsPageSettingsAPIView.as_view(), name='terms-settings'),
    path('', include(router.urls)),
]
