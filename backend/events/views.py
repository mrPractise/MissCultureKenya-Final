from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from .models import Event, EventInquiry, EventCategory, EventSettings
from .serializers import (
    EventSerializer, EventInquirySerializer, EventCategorySerializer, EventSettingsSerializer
)


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.filter(published=True)
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'status', 'featured', 'city', 'country']
    search_fields = ['title', 'description', 'venue_name', 'city']
    ordering_fields = ['start_date', 'title', 'created_at']
    ordering = ['-start_date']

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        upcoming_events = self.get_queryset().filter(
            start_date__gte=timezone.now(),
            status='upcoming'
        ).order_by('start_date')
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def past(self, request):
        """Get past events"""
        past_events = self.get_queryset().filter(
            start_date__lt=timezone.now()
        ).order_by('-start_date')
        serializer = self.get_serializer(past_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured events"""
        featured_events = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(featured_events, many=True)
        return Response(serializer.data)


class EventInquiryViewSet(viewsets.ModelViewSet):
    queryset = EventInquiry.objects.all()
    serializer_class = EventInquirySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['inquiry_type', 'status']
    search_fields = ['name', 'organization', 'email', 'event_title']
    ordering_fields = ['created_at', 'name']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        """Create a new event inquiry"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            inquiry = serializer.save()
            
            # Send email notification to admin
            email_subject = f"[Miss Culture Kenya] Event Inquiry: {inquiry.event_title or 'New Inquiry'}"
            plain_body = (
                f"New Event Inquiry\n"
                f"------------------\n"
                f"Name: {inquiry.name}\n"
                f"Organization: {inquiry.organization or 'N/A'}\n"
                f"Email: {inquiry.email}\n"
                f"Phone: {inquiry.phone or 'N/A'}\n"
                f"Event Title: {inquiry.event_title or 'N/A'}\n"
                f"Inquiry Type: {inquiry.inquiry_type}\n\n"
                f"Message:\n{inquiry.message or 'No message provided'}\n\n"
                f"---\nSent via Miss Culture Global Kenya website"
            )
            html_body = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #15803d;">New Event Inquiry — Miss Culture Global Kenya</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td><td style="padding: 8px;">{inquiry.name}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Organization:</td><td style="padding: 8px;">{inquiry.organization or 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:{inquiry.email}">{inquiry.email}</a></td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">{inquiry.phone or 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Event Title:</td><td style="padding: 8px;">{inquiry.event_title or 'N/A'}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Inquiry Type:</td><td style="padding: 8px;">{inquiry.inquiry_type}</td></tr>
                </table>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <h3 style="color: #374151;">Message</h3>
                <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">{inquiry.message or 'No message provided'}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">This inquiry was submitted via the Miss Culture Global Kenya events page.</p>
            </div>
            """
            try:
                send_mail(
                    subject=email_subject,
                    message=plain_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.ADMIN_EMAIL],
                    html_message=html_body,
                    fail_silently=True,
                )
            except Exception:
                pass  # Don't fail the inquiry creation if email fails
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class EventSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventSettings.objects.all()
    serializer_class = EventSettingsSerializer