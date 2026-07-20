import random
import string
import requests
import json
from django.conf import settings
from .models import Ticket


# Characters that are not ambiguous (no 0/O, 1/I/l)
TICKET_CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'


def generate_ticket_code(event_prefix, event_year):
    """
    Generate a unique ticket code in the format: PREFIX-RAND4#YY

    Example: FOS-WER3#26
      FOS  = event prefix (first 2-3 consonants of event name)
      WER3 = random 4-character alphanumeric (no ambiguous chars)
      26   = last 2 digits of event year

    Retries on collision (extremely unlikely with 30^4 = 810,000 combinations).
    """
    prefix = event_prefix.upper()[:3]
    year_suffix = str(event_year)[-2:]

    for _ in range(100):  # Max 100 attempts before giving up
        random_part = ''.join(random.choices(TICKET_CODE_CHARS, k=4))
        code = f"{prefix}-{random_part}#{year_suffix}"

        if not Ticket.objects.filter(ticket_code=code).exists():
            return code

    raise RuntimeError(f"Could not generate unique ticket code for prefix '{prefix}' after 100 attempts")


def calculate_vote_count(amount, vote_price):
    """
    Calculate the number of votes from a confirmed payment amount.
    Always uses integer division — remainder is ignored (backend-only calculation).

    Returns: int — number of whole votes
    """
    if not vote_price or vote_price <= 0:
        return 0
    return int(amount // vote_price)


def mask_phone_number(phone):
    """
    Mask a phone number for privacy: show first 3 and last 3 digits.

    Example: 0712345678 -> 071***678
    """
    if not phone or len(phone) < 7:
        return phone
    return f"{phone[:3]}***{phone[-3:]}"


def send_telegram_message(message):
    """
    Send a notification message to a Telegram chat.
    Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in settings.
    """
    token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
    chat_id = getattr(settings, 'TELEGRAM_CHAT_ID', None)
    
    if not token or not chat_id:
        return False
        
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'HTML'
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"Telegram notification error: {e}")
        return False


def send_ticket_email(ticket, event, pdf_buffer):
    """
    Send the ticket PDF to the attendee via the Resend API.

    The whole project sends mail through Resend (see main/views.py) — there is no
    SMTP backend configured — so this must use Resend too, with the ticket PDF
    attached as a base64 payload.

    Args:
        ticket: Ticket model instance
        event: Event model instance
        pdf_buffer: BytesIO buffer containing PDF

    Returns:
        bool: True if email sent successfully
    """
    import base64
    import logging
    import resend

    logger = logging.getLogger(__name__)

    if not ticket.email:
        return False

    api_key = getattr(settings, 'RESEND_API_KEY', '')
    if not api_key:
        logger.error("Ticket email skipped: RESEND_API_KEY is not configured.")
        return False

    subject = f"Your Ticket for {event.title} - Miss Culture Global Kenya"

    text_body = f"""
Dear {ticket.full_name},

Thank you for your purchase! Your ticket has been confirmed for:

EVENT: {event.title}
DATE: {event.start_date.strftime('%A, %B %d, %Y')}
TIME: {event.start_date.strftime('%I:%M %p')}
VENUE: {event.venue_name}
LOCATION: {event.city}, {event.country}
TICKET CODE: {ticket.ticket_code}

Please find your ticket PDF attached. Present it at the entrance for check-in.

Important Notes:
- This ticket is non-transferable and non-refundable
- Please arrive at least 30 minutes before the event starts
- Bring a valid ID matching the name on this ticket

For inquiries, contact us at info@misscultureglobalkenya.com

Best regards,
Miss Culture Global Kenya Team
"""

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #15803d;">Your Ticket is Confirmed!</h2>
        <p style="color: #4b5563; line-height: 1.6;">Dear {ticket.full_name},</p>
        <p style="color: #4b5563; line-height: 1.6;">Thank you for your purchase. Your ticket has been confirmed for:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Event</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">{event.title}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Date</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">{event.start_date.strftime('%A, %B %d, %Y')}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Time</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">{event.start_date.strftime('%I:%M %p')}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Venue</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">{event.venue_name}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Location</td><td style="padding: 6px 0; font-weight: bold; color: #111827;">{event.city}, {event.country}</td></tr>
        </table>
        <div style="text-align: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-size: 12px; color: #16a34a; text-transform: uppercase; letter-spacing: 1px;">Ticket Code</p>
            <p style="margin: 4px 0 0; font-size: 26px; font-weight: bold; color: #15803d; letter-spacing: 3px;">{ticket.ticket_code}</p>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">Your ticket PDF is attached. Present it at the entrance for check-in.</p>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
            This ticket is non-transferable and non-refundable. Please arrive at least 30 minutes early and bring a valid ID matching the name on this ticket.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
        <p style="font-size: 12px; color: #9ca3af;">
            Miss Culture Global Kenya<br>info@misscultureglobalkenya.com
        </p>
    </div>
    """

    try:
        pdf_base64 = base64.b64encode(pdf_buffer.getvalue()).decode('utf-8')
        resend.api_key = api_key
        resend.Emails.send({
            'from': getattr(settings, 'DEFAULT_FROM_EMAIL', 'info@misscultureglobalkenya.com'),
            'to': ticket.email,
            'subject': subject,
            'html': html_body,
            'text': text_body,
            'attachments': [{
                'filename': f"ticket_{ticket.ticket_code}.pdf",
                'content': pdf_base64,
            }],
        })
        return True
    except Exception as e:
        logger.error(f"Ticket email error for {ticket.ticket_code}: {e}")
        return False
