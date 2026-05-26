from decimal import Decimal

from django.conf import settings
from intasend import APIService


SUCCESS_STATES = {'COMPLETE'}
FAILED_STATES = {'FAILED'}


def _service():
    publishable_key = getattr(settings, 'INTASEND_PUBLISHABLE_KEY', '')
    if not publishable_key:
        raise ValueError('INTASEND_PUBLISHABLE_KEY is not configured.')

    token = getattr(settings, 'INTASEND_SECRET_KEY', '') or 'checkout-only'
    return APIService(
        token=token,
        publishable_key=publishable_key,
        test=getattr(settings, 'INTASEND_TEST_MODE', True),
    )


def create_checkout(*, email, amount, api_ref, comment, phone_number='', redirect_url='', callback_url='', name=''):
    first_name = ''
    last_name = ''
    if name:
        parts = name.strip().split(maxsplit=1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

    response = _service().collect.checkout(
        email=email,
        amount=float(Decimal(amount)),
        currency='KES',
        method='M-PESA',
        api_ref=api_ref,
        comment=comment,
        phone_number=phone_number,
        first_name=first_name,
        last_name=last_name,
        redirect_url=redirect_url,
        callback_url=callback_url,
    )

    return {
        'success': bool(response.get('url')),
        'checkout_url': response.get('url'),
        'invoice_id': response.get('invoice_id') or response.get('id') or '',
        'api_ref': response.get('api_ref') or api_ref,
        'raw': response,
        'error': response.get('detail') or response.get('error'),
    }


def normalize_collection_payload(data):
    invoice = data.get('invoice') if isinstance(data.get('invoice'), dict) else data
    state = (invoice.get('state') or data.get('state') or '').upper()
    return {
        'invoice_id': invoice.get('invoice_id') or invoice.get('id') or data.get('invoice_id') or '',
        'api_ref': invoice.get('api_ref') or data.get('api_ref') or '',
        'state': state,
        'is_successful': state in SUCCESS_STATES,
        'is_failed': state in FAILED_STATES,
        'provider': invoice.get('provider') or data.get('provider') or '',
        'amount': invoice.get('value') or data.get('value') or data.get('amount'),
        'mpesa_reference': invoice.get('mpesa_reference') or data.get('mpesa_reference') or '',
        'failed_reason': invoice.get('failed_reason') or data.get('failed_reason') or '',
    }


def check_payment_status(invoice_id):
    response = _service().collect.status(invoice_id=invoice_id)
    normalized = normalize_collection_payload(response.get('invoice') or response)
    normalized['raw'] = response
    return normalized
