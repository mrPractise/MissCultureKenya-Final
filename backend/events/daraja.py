"""
Safaricom M-Pesa Daraja API integration for STK Push (Lipa na M-Pesa Online).

Environment:
    sandbox    → https://sandbox.safaricom.co.ke
    production → https://api.safaricom.co.ke
"""

import base64
import json
from datetime import datetime
from typing import Optional

import requests
from django.conf import settings


# ── Environment URLs ─────────────────────────────────────────────────────────

BASE_URLS = {
    'sandbox': 'https://sandbox.safaricom.co.ke',
    'production': 'https://api.safaricom.co.ke',
}


def _base_url() -> str:
    env = getattr(settings, 'MPESA_ENVIRONMENT', 'sandbox')
    return BASE_URLS.get(env, BASE_URLS['sandbox'])


# ── OAuth: Access Token ──────────────────────────────────────────────────────

def get_access_token() -> Optional[str]:
    """
    Obtain an OAuth access token from Daraja using Consumer Key + Secret.
    Returns the token string or None on failure.
    """
    consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
    consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')

    if not consumer_key or not consumer_secret:
        return None

    url = f"{_base_url()}/oauth/v1/generate?grant_type=client_credentials"
    credentials = base64.b64encode(
        f"{consumer_key}:{consumer_secret}".encode()
    ).decode()

    headers = {"Authorization": f"Basic {credentials}"}

    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("access_token")
    except requests.RequestException:
        return None


# ── STK Push ─────────────────────────────────────────────────────────────────

def generate_password(shortcode: str, passkey: str, timestamp: str) -> str:
    """
    Generate the Base64-encoded password required for STK Push.
    Format: Base64(Shortcode + Passkey + Timestamp)
    """
    raw = f"{shortcode}{passkey}{timestamp}"
    return base64.b64encode(raw.encode()).decode()


def initiate_stk_push(
    phone_number: str,
    amount: float,
    account_reference: str,
    transaction_desc: str,
    callback_url: str,
) -> dict:
    """
    Initiate an M-Pesa STK Push (Lipa na M-Pesa Online).

    Args:
        phone_number: Customer phone number (e.g. 254712345678)
        amount: Amount to charge
        account_reference: What appears on the customer's statement
        transaction_desc: Short description of the transaction
        callback_url: HTTPS URL where M-Pesa will POST the result

    Returns:
        dict with Daraja response or error info:
        {
            "success": bool,
            "checkout_request_id": str | None,
            "merchant_request_id": str | None,
            "response_code": str | None,
            "response_description": str | None,
            "error": str | None,
        }
    """
    token = get_access_token()
    if not token:
        return {
            "success": False,
            "checkout_request_id": None,
            "merchant_request_id": None,
            "response_code": None,
            "response_description": None,
            "error": "Unable to obtain Daraja access token. Check consumer key/secret.",
        }

    shortcode = getattr(settings, 'MPESA_SHORTCODE', '174379')
    passkey = getattr(settings, 'MPESA_PASSKEY', '')

    # Normalize phone: ensure it starts with 254
    phone = phone_number.strip()
    if phone.startswith('0'):
        phone = '254' + phone[1:]
    elif phone.startswith('+'):
        phone = phone[1:]
    if not phone.startswith('254'):
        phone = '254' + phone

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = generate_password(shortcode, passkey, timestamp)

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": account_reference[:12],  # Max 12 chars
        "TransactionDesc": transaction_desc[:13],      # Max 13 chars
    }

    url = f"{_base_url()}/mpesa/stkpush/v1/processrequest"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()

        return {
            "success": data.get("ResponseCode") == "0",
            "checkout_request_id": data.get("CheckoutRequestID"),
            "merchant_request_id": data.get("MerchantRequestID"),
            "response_code": data.get("ResponseCode"),
            "response_description": data.get("ResponseDescription"),
            "error": data.get("errorMessage") if data.get("ResponseCode") != "0" else None,
        }
    except requests.HTTPError as e:
        try:
            err_data = e.response.json()
            error_msg = err_data.get("errorMessage", str(e))
        except ValueError:
            error_msg = str(e)
        return {
            "success": False,
            "checkout_request_id": None,
            "merchant_request_id": None,
            "response_code": None,
            "response_description": None,
            "error": error_msg,
        }
    except requests.RequestException as e:
        return {
            "success": False,
            "checkout_request_id": None,
            "merchant_request_id": None,
            "response_code": None,
            "response_description": None,
            "error": f"Network error: {str(e)}",
        }


# ── Callback Processing ──────────────────────────────────────────────────────

def process_callback(raw_body: bytes) -> dict:
    """
    Parse and normalize an M-Pesa STK Push callback payload.

    Args:
        raw_body: The raw POST body from M-Pesa (JSON bytes)

    Returns:
        dict with normalized result:
        {
            "success": bool,
            "checkout_request_id": str,
            "merchant_request_id": str,
            "result_code": int,
            "result_desc": str,
            "mpesa_receipt_number": str | None,  # e.g. "MK1234ABC"
            "transaction_date": str | None,      # e.g. "20240101120000"
            "phone_number": str | None,
            "amount": float | None,
            "error": str | None,
        }
    """
    try:
        data = json.loads(raw_body)
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "checkout_request_id": "",
            "merchant_request_id": "",
            "result_code": -1,
            "result_desc": f"Invalid JSON: {str(e)}",
            "mpesa_receipt_number": None,
            "transaction_date": None,
            "phone_number": None,
            "amount": None,
            "error": "Invalid JSON payload",
        }

    # The callback wraps everything in Body -> stkCallback
    stk_callback = data.get("Body", {}).get("stkCallback", {})

    checkout_request_id = stk_callback.get("CheckoutRequestID", "")
    merchant_request_id = stk_callback.get("MerchantRequestID", "")
    result_code = stk_callback.get("ResultCode", -1)
    result_desc = stk_callback.get("ResultDesc", "")

    result = {
        "success": result_code == 0,
        "checkout_request_id": checkout_request_id,
        "merchant_request_id": merchant_request_id,
        "result_code": result_code,
        "result_desc": result_desc,
        "mpesa_receipt_number": None,
        "transaction_date": None,
        "phone_number": None,
        "amount": None,
        "error": None,
    }

    if result_code != 0:
        result["error"] = result_desc
        return result

    # Extract CallbackMetadata items
    metadata = stk_callback.get("CallbackMetadata", {}).get("Item", [])
    for item in metadata:
        name = item.get("Name")
        value = item.get("Value")
        if name == "MpesaReceiptNumber":
            result["mpesa_receipt_number"] = value
        elif name == "TransactionDate":
            result["transaction_date"] = str(value) if value else None
        elif name == "PhoneNumber":
            result["phone_number"] = str(value) if value else None
        elif name == "Amount":
            result["amount"] = float(value) if value else None

    return result


# ── Query STK Status ─────────────────────────────────────────────────────────

def query_stk_status(checkout_request_id: str) -> dict:
    """
    Query the status of an STK Push transaction.
    Useful for polling if the callback hasn't been received yet.
    """
    token = get_access_token()
    if not token:
        return {"success": False, "error": "Unable to obtain access token."}

    shortcode = getattr(settings, 'MPESA_SHORTCODE', '174379')
    passkey = getattr(settings, 'MPESA_PASSKEY', '')
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = generate_password(shortcode, passkey, timestamp)

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "CheckoutRequestID": checkout_request_id,
    }

    url = f"{_base_url()}/mpesa/stkpushquery/v1/query"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        return {
            "success": data.get("ResultCode") == "0",
            "result_code": data.get("ResultCode"),
            "result_desc": data.get("ResultDesc"),
            "checkout_request_id": data.get("CheckoutRequestID"),
            "error": data.get("errorMessage"),
        }
    except requests.RequestException as e:
        return {"success": False, "error": str(e)}
