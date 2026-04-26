from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet, EventInquiryViewSet, EventCategoryViewSet, EventSettingsViewSet
)

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'inquiries', EventInquiryViewSet)
router.register(r'categories', EventCategoryViewSet)
router.register(r'settings', EventSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
