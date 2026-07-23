from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet, EventCategoryViewSet,
    TicketCategoryViewSet, ContestantViewSet, PaymentViewSet,
    TicketViewSet, VoteTransactionViewSet, AuditLogViewSet,
    verify_votes_by_phone, ticket_lookup, ticket_pdf_download, mpesa_callback,
    initiate_contribution_payment, contribution_status,
    pesapal_ipn_callback, pesapal_payment_redirect,
    checkin_events, checkin_list, checkin_toggle,
    finance_report, finance_statement_pdf,
)

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'categories', EventCategoryViewSet)
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
    path('ticket-pdf/', ticket_pdf_download, name='ticket-pdf'),
    path('checkin/events/', checkin_events, name='checkin-events'),
    path('checkin/list/', checkin_list, name='checkin-list'),
    path('checkin/toggle/', checkin_toggle, name='checkin-toggle'),
    path('finance/report/', finance_report, name='finance-report'),
    path('finance/statement-pdf/', finance_statement_pdf, name='finance-statement-pdf'),
    path('contributions/initiate/', initiate_contribution_payment, name='initiate-contribution-payment'),
    path('contributions/<int:pk>/', contribution_status, name='contribution-status'),
    path('pesapal-ipn/', pesapal_ipn_callback, name='pesapal-ipn'),
    path('pesapal-redirect/', pesapal_payment_redirect, name='pesapal-redirect'),
    path('mpesa-callback/', mpesa_callback, name='mpesa-callback'),
    path('cb/', mpesa_callback, name='mpesa-callback-short'),
]
