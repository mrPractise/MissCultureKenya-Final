"""
M-Pesa Daraja STK Push Integration Module

Handles STK Push initiation and callback processing for M-Pesa payments.
"""
import base64
import datetime
from django.conf import settings
import requests
from django.utils import timezone


def get_daraja_credentials():
    """
    Get Daraja credentials from settings.
    
    Required settings:
    - MPESA_CONSUMER_KEY
    - MPESA_CONSUMER_SECRET
    - MPESA_PASSKEY
    - MPESA_SHORTCODE
    - MPESA_ENVIRONMENT (sandbox or production)
    """
    return {
        'consumer_key': getattr(settings, 'MPESA_CONSUMER_KEY', ''),
        'consumer_secret': getattr(settings, 'MPESA_CONSUMER_SECRET', ''),
        'passkey': getattr(settings, 'MPESA_PASSKEY', ''),
        'shortcode': getattr(settings, 'MPESA_SHORTCODE', ''),
        'environment': getattr(settings, 'MPESA_ENVIRONMENT', 'sandbox'),
    }


def get_daraja_auth_token():
    """
    Generate and return Daraja OAuth access token.
    """
    creds = get_daraja_credentials()
    
    if not creds['consumer_key'] or not creds['consumer_secret']:
        return {'success': False, 'error': 'Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET'}
    
    # Determine API URL based on environment
    if creds['environment'] == 'production':
        auth_url = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    else:
        auth_url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    
    try:
        response = requests.get(
            auth_url,
            auth=(creds['consumer_key'], creds['consumer_secret']),
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        access_token = data.get('access_token')
        
        if not access_token:
            return {'success': False, 'error': 'No access token in response'}
        
        return {'success': True, 'access_token': access_token}
    
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': f'Auth request failed: {str(e)}'}
    except Exception as e:
        return {'success': False, 'error': f'Unexpected error: {str(e)}'}


def generate_password(shortcode, passkey, timestamp):
    """
    Generate base64 encoded password for STK Push.
    Password = Base64(BusinessShortcode + Passkey + Timestamp)
    """
    data_to_encode = f"{shortcode}{passkey}{timestamp}"
    encoded_bytes = base64.b64encode(data_to_encode.encode('utf-8'))
    return encoded_bytes.decode('utf-8')


def initiate_stk_push(phone_number, amount, account_reference, transaction_desc, callback_url):
    """
    Initiate STK Push for M-Pesa payment.
    
    Args:
        phone_number: Phone number (format: 254XXXXXXXXX)
        amount: Amount to charge
        account_reference: Account reference (e.g., payment ID)
        transaction_desc: Transaction description
        callback_url: URL where Safaricom will send callback
    
    Returns:
        dict with success status and response data
    """
    creds = get_daraja_credentials()
    
    # Validate required credentials
    if not all([creds['shortcode'], creds['passkey']]):
        return {'success': False, 'error': 'Missing MPESA_SHORTCODE or MPESA_PASSKEY'}
    
    # Get auth token
    auth_result = get_daraja_auth_token()
    if not auth_result['success']:
        return auth_result
    
    access_token = auth_result['access_token']
    
    # Format phone number (ensure it starts with 254)
    if phone_number.startswith('0'):
        phone_number = '254' + phone_number[1:]
    elif phone_number.startswith('+'):
        phone_number = phone_number[1:]
    
    # Generate timestamp and password
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    password = generate_password(creds['shortcode'], creds['passkey'], timestamp)
    
    # Determine API URL based on environment
    if creds['environment'] == 'production':
        stk_push_url = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    else:
        stk_push_url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    
    # Prepare STK Push payload
    payload = {
        'BusinessShortCode': creds['shortcode'],
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': int(amount),
        'PartyA': phone_number,
        'PartyB': creds['shortcode'],
        'PhoneNumber': phone_number,
        'CallBackURL': callback_url,
        'AccountReference': account_reference,
        'TransactionDesc': transaction_desc,
    }
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    
    try:
        response = requests.post(
            stk_push_url,
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        
        # Check for response code
        response_code = data.get('ResponseCode')
        if response_code == '0':
            return {
                'success': True,
                'checkout_request_id': data.get('CheckoutRequestID'),
                'merchant_request_id': data.get('MerchantRequestID'),
                'customer_message': data.get('CustomerMessage'),
                'response_code': response_code,
                'raw': data,
            }
        else:
            return {
                'success': False,
                'error': data.get('errorMessage', 'STK Push failed'),
                'response_code': response_code,
                'raw': data,
            }
    
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': f'STK Push request failed: {str(e)}'}
    except Exception as e:
        return {'success': False, 'error': f'Unexpected error: {str(e)}'}


def process_callback(callback_data):
    """
    Process Safaricom STK Push callback.
    
    Args:
        callback_data: Raw callback data from Safaricom
    
    Returns:
        dict with processed callback information
    """
    try:
        body = callback_data.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        merchant_request_id = stk_callback.get('MerchantRequestID')
        
        metadata = stk_callback.get('Metadata', {})
        
        # Extract payment details from metadata
        amount = None
        mpesa_receipt_number = None
        phone_number = None
        transaction_date = None
        
        for item in metadata:
            name = item.get('Name')
            value = item.get('Value')
            
            if name == 'Amount':
                amount = value
            elif name == 'MpesaReceiptNumber':
                mpesa_receipt_number = value
            elif name == 'PhoneNumber':
                phone_number = value
            elif name == 'TransactionDate':
                transaction_date = value
        
        return {
            'success': result_code == 0,
            'result_code': result_code,
            'result_desc': result_desc,
            'checkout_request_id': checkout_request_id,
            'merchant_request_id': merchant_request_id,
            'amount': amount,
            'mpesa_receipt_number': mpesa_receipt_number,
            'phone_number': phone_number,
            'transaction_date': transaction_date,
            'raw': callback_data,
        }
    
    except Exception as e:
        return {
            'success': False,
            'error': f'Failed to process callback: {str(e)}',
            'raw': callback_data,
        }
