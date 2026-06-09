import os
import sys
import django
import json

# Ensure the backend package (project) dir is on sys.path when running from scripts/
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'missculture.settings')
django.setup()

from events.models import Payment, VoteTransaction

phones = ['+254729151721', '254729151721', '0729151721', '729151721']

for p in phones:
    search = p[-9:] if len(p) >= 9 else p
    print('\n=== Searching for phone variant:', p, ' (search digits:', search, ') ===')

    payments_qs = Payment.objects.filter(phone_number__contains=search).order_by('-created_at')
    payments = []
    for pay in payments_qs[:25]:
        payments.append({
            'id': pay.id,
            'event_id': pay.event_id,
            'phone_number': pay.phone_number,
            'status': pay.status,
            'payment_type': pay.payment_type,
            'amount': str(pay.amount),
            'pesapal_tracking_id': pay.pesapal_tracking_id,
            'mpesa_code': pay.mpesa_code,
            'created_at': pay.created_at.isoformat(),
        })

    votes_qs = VoteTransaction.objects.filter(phone_number__contains=search).order_by('-created_at')
    votes = []
    for v in votes_qs[:25]:
        votes.append({
            'id': v.id,
            'event_id': v.event_id,
            'contestant_id': v.contestant_id,
            'vote_count': v.vote_count,
            'phone_number': v.phone_number,
            'mpesa_code': v.mpesa_code,
            'status': v.status,
            'created_at': v.created_at.isoformat(),
        })

    out = {
        'search': search,
        'payments_count': payments_qs.count(),
        'payments_sample': payments,
        'votes_count': votes_qs.count(),
        'votes_sample': votes,
    }

    print(json.dumps(out, indent=2))

print('\nDone.')
