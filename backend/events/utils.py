import random
import string
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
