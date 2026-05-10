import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'missculture.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

name = "Test User"
email = "test@example.com"
phone = "1234567890"
subject = "Test Form Subject"
message = "Test message body"
inquiry_type = "general"

subject_prefixes = {
    'general': 'General Inquiry',
}
email_subject = f"[Miss Culture Kenya] {subject_prefixes.get(inquiry_type, 'Contact')}: {subject}"

html_body = f"<h2>Test HTML</h2>"
plain_body = f"Test plain body"

try:
    print("Testing admin email...")
    send_mail(
        subject=email_subject,
        message=plain_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        html_message=html_body,
        fail_silently=False,
    )
    print("Admin email sent.")
except Exception as e:
    import traceback
    traceback.print_exc()

try:
    print("Testing auto-reply email...")
    send_mail(
        subject="Auto reply",
        message="Auto reply body",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
    print("Auto-reply sent.")
except Exception as e:
    import traceback
    traceback.print_exc()
