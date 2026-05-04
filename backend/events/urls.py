from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet, EventInquiryViewSet, EventCategoryViewSet, EventSettingsViewSet,
    TicketCategoryViewSet, ContestantViewSet, PaymentViewSet,
    TicketViewSet, VoteTransactionViewSet, AuditLogViewSet,
    verify_votes_by_phone, ticket_lookup, mpesa_callback,
)

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'inquiries', EventInquiryViewSet)
router.register(r'categories', EventCategoryViewSet)
router.register(r'settings', EventSettingsViewSet)
router.register(r'ticket-categories', TicketCategoryViewSet)
router.register(r'contestants', ContestantViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'tickets', TicketViewSet)
router.register(r'vote-transactions', VoteTransactionViewSet)
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('verify-votes/', verify_votes_by_phone, name='verify-votes'),
    path('ticket-lookup/', ticket_lookup, name='ticket-lookup'),
    path('mpesa-callback/', mpesa_callback, name='mpesa-callback'),
]
