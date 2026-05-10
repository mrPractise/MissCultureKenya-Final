import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'missculture.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

try:
    print(f"Sending email as {settings.EMAIL_HOST_USER} from {settings.DEFAULT_FROM_EMAIL}")
    send_mail(
        subject='Test Email from Script',
        message='This is a test to verify Zoho SMTP settings.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        fail_silently=False,
    )
    print("Email sent successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
