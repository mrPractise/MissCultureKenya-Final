"""Background jobs for external I/O that must not block the request thread.

The three side effects here — ticket PDF generation + email, and Telegram
alerts — all run inside the M-Pesa callback path. Safaricom retries a callback
that responds slowly, which risks double-processing, so we push this work to a
Redis-backed RQ queue and let the callback return immediately.

Everything is enqueued through :func:`enqueue_or_run`, which falls back to
running the job **synchronously** whenever the queue can't be reached (django-rq
not installed, REDIS_URL unset, or Redis down). Consequences:

* Until REDIS_URL + a worker exist, the app behaves exactly as before.
* If Redis goes down later, a paid customer's ticket email is never silently
  dropped — it just runs inline as it used to.
"""

import logging

logger = logging.getLogger(__name__)


def enqueue_or_run(func, *args, **kwargs):
    """Enqueue ``func`` on the default RQ queue, or run it synchronously.

    Any failure reaching the queue (import error, missing REDIS_URL, Redis
    connection error) triggers a synchronous fallback so the side effect still
    happens. Returns the RQ job on success, otherwise the function's return
    value (or None if the fallback itself failed).
    """
    name = getattr(func, '__name__', repr(func))
    try:
        import django_rq
        queue = django_rq.get_queue('default')
        return queue.enqueue(func, *args, **kwargs)
    except Exception as exc:
        logger.warning("enqueue failed for %s (%s); running synchronously", name, exc)
        try:
            return func(*args, **kwargs)
        except Exception:
            logger.exception("synchronous fallback failed for %s", name)
            return None


def deliver_tickets(payment_id):
    """Generate the PDF and email every ticket for a payment, then send a
    Telegram summary. Reloads everything from the DB by id so it is safe to run
    in a separate worker process (enqueue after the DB commit).
    """
    from .models import Payment
    from .ticket_pdf import generate_ticket_pdf
    from .utils import send_telegram_message, send_ticket_email

    payment = Payment.objects.filter(id=payment_id).select_related('event').first()
    if not payment:
        logger.warning("deliver_tickets: payment %s not found", payment_id)
        return

    event = payment.event
    tickets = list(payment.tickets.select_related('ticket_category').all())
    if not tickets:
        return

    emails_sent = 0
    for ticket in tickets:
        if not ticket.email:
            continue
        try:
            pdf_buffer = generate_ticket_pdf(ticket, event)
            if send_ticket_email(ticket, event, pdf_buffer):
                emails_sent += 1
        except Exception:
            logger.exception("deliver_tickets: failed to email ticket %s", ticket.ticket_code)

    try:
        ticket_lines = '\n'.join(
            f"• {t.ticket_code} — {t.ticket_category.name if t.ticket_category else 'General'}"
            for t in tickets
        )
        send_telegram_message(
            f"🎫 <b>New Ticket Purchase</b>\n\n"
            f"Event: {event.title}\n"
            f"Buyer: {payment.full_name}\n"
            f"Phone: {payment.phone_number}\n"
            f"Tickets: {len(tickets)}\n"
            f"Amount: KES {payment.amount}\n\n"
            f"Tickets (Code — Category):\n{ticket_lines}\n"
            f"Emails Sent: {emails_sent}/{len(tickets)}"
        )
    except Exception:
        logger.exception("deliver_tickets: failed to send Telegram summary for payment %s", payment_id)


def send_telegram(message):
    """Enqueueable wrapper around the Telegram notification helper."""
    from .utils import send_telegram_message
    send_telegram_message(message)
