"""
PesaPal API v3 service module for contribution (donation) payments.

Flow:
1. generate_access_token() → Bearer token (5 min TTL, cached 4.5 min)
2. register_ipn_url() → notification_id (one-time setup)
3. submit_order() → redirect_url (PesaPal hosted checkout)
4. get_transaction_status() → verify payment after IPN callback

Sandbox:  https://cybqa.pesapal.com/pesapalv3/api
Live:     https://pay.pesapal.com/v3/api
"""

import logging
import time

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Token cache (in-process, avoids hitting auth on every request)
# ---------------------------------------------------------------------------
_token_cache: dict = {"token": "", "expires_at": 0.0}


def _base_url() -> str:
    return getattr(settings, "PESAPAL_BASE_URL", "https://pay.pesapal.com/v3/api")


def _consumer_key() -> str:
    return getattr(settings, "PESAPAL_CONSUMER_KEY", "")


def _consumer_secret() -> str:
    return getattr(settings, "PESAPAL_CONSUMER_SECRET", "")


# ---------------------------------------------------------------------------
# 1. Authentication
# ---------------------------------------------------------------------------

def generate_access_token(force_refresh: bool = False) -> str:
    """
    Return a valid PesaPal OAuth2 Bearer token.
    Cached for 4.5 minutes (token TTL is 5 min).
    """
    now = time.time()
    if not force_refresh and _token_cache["token"] and _token_cache["expires_at"] > now:
        return _token_cache["token"]

    url = f"{_base_url()}/Auth/RequestToken"
    payload = {
        "consumer_key": _consumer_key(),
        "consumer_secret": _consumer_secret(),
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=(5, 15))
        resp.raise_for_status()
        data = resp.json()
        token = data.get("token", "")
        if token:
            _token_cache["token"] = token
            _token_cache["expires_at"] = now + 270  # 4.5 min
            return token
        logger.error("PesaPal auth returned no token: %s", data)
        return ""
    except requests.RequestException as exc:
        logger.error("PesaPal auth failed: %s", exc)
        return ""


# ---------------------------------------------------------------------------
# 2. IPN URL registration (one-time setup)
# ---------------------------------------------------------------------------

def register_ipn_url(ipn_url: str) -> dict:
    """
    Register an IPN URL with PesaPal.
    Returns the full API response including `ipn_id`.
    """
    token = generate_access_token()
    if not token:
        return {"error": "Failed to obtain PesaPal access token."}

    url = f"{_base_url()}/URLSetup/RegisterIPN"
    payload = {
        "url": ipn_url,
        "ipn_notification_type": "GET",
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=(5, 15))
        return resp.json()
    except requests.RequestException as exc:
        logger.error("PesaPal register IPN failed: %s", exc)
        return {"error": str(exc)}


def get_registered_ipns() -> list:
    """Return list of registered IPN URLs from PesaPal."""
    token = generate_access_token()
    if not token:
        return []

    url = f"{_base_url()}/URLSetup/GetIpnList"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }

    try:
        resp = requests.get(url, headers=headers, timeout=(5, 15))
        return resp.json() if resp.status_code == 200 else []
    except requests.RequestException:
        return []


# ---------------------------------------------------------------------------
# 3. Submit Order (create payment)
# ---------------------------------------------------------------------------

def submit_order(
    *,
    order_id: str,
    amount,
    currency: str = "KES",
    description: str = "",
    callback_url: str = "",
    notification_id: str = "",
    first_name: str = "",
    last_name: str = "",
    email: str = "",
    phone_number: str = "",
) -> dict:
    """
    Submit an order request to PesaPal.

    Returns:
        {
            "success": bool,
            "redirect_url": str,      # PesaPal checkout page URL
            "order_tracking_id": str, # PesaPal's tracking ID for this order
            "error": str | None,
            "raw": dict,              # Full API response
        }
    """
    token = generate_access_token()
    if not token:
        return {"success": False, "redirect_url": "", "order_tracking_id": "", "error": "Failed to obtain PesaPal access token."}

    url = f"{_base_url()}/Transactions/SubmitOrderRequest"

    # Build billing address from available data
    billing_address = {}
    if email:
        billing_address["email_address"] = email
    if phone_number:
        billing_address["phone_number"] = phone_number
    if first_name:
        billing_address["first_name"] = first_name
    if last_name:
        billing_address["last_name"] = last_name
    billing_address["country_code"] = "KE"
    billing_address["line_1"] = ""
    billing_address["city"] = ""

    payload = {
        "id": order_id,
        "currency": currency,
        "amount": float(amount),
        "description": description,
        "callback_url": callback_url,
        "notification_id": notification_id,
        "billing_address": billing_address,
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=(5, 20))
        data = resp.json()

        redirect_url = data.get("redirect_url", "")
        order_tracking_id = data.get("order_tracking_id", "")

        if resp.status_code in (200, 201) and redirect_url:
            return {
                "success": True,
                "redirect_url": redirect_url,
                "order_tracking_id": order_tracking_id,
                "error": None,
                "raw": data,
            }

        error_msg = data.get("error", {}).get("message", "") or data.get("message", "") or f"PesaPal returned HTTP {resp.status_code}"
        return {
            "success": False,
            "redirect_url": "",
            "order_tracking_id": order_tracking_id,
            "error": error_msg,
            "raw": data,
        }
    except requests.RequestException as exc:
        logger.error("PesaPal submit_order failed: %s", exc)
        return {"success": False, "redirect_url": "", "order_tracking_id": "", "error": str(exc), "raw": {}}


# ---------------------------------------------------------------------------
# 4. Get Transaction Status
# ---------------------------------------------------------------------------

def get_transaction_status(order_tracking_id: str, merchant_reference: str = "") -> dict:
    """
    Query PesaPal for the current status of a transaction.

    Returns:
        {
            "payment_status": str,   # COMPLETED, FAILED, PENDING, INVALID, etc.
            "payment_method": str,
            "amount": str,
            "currency": str,
            "raw": dict,
        }
    """
    token = generate_access_token()
    if not token:
        return {"payment_status": "UNKNOWN", "raw": {}}

    url = f"{_base_url()}/Transactions/GetTransactionStatus"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    params = {
        "order_tracking_id": order_tracking_id,
    }
    if merchant_reference:
        params["order_merchant_reference"] = merchant_reference

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=(5, 15))
        data = resp.json()
        return {
            "payment_status": data.get("payment_status", "UNKNOWN"),
            "payment_method": data.get("payment_method", ""),
            "amount": data.get("amount", ""),
            "currency": data.get("currency", ""),
            "raw": data,
        }
    except requests.RequestException as exc:
        logger.error("PesaPal get_transaction_status failed: %s", exc)
        return {"payment_status": "UNKNOWN", "raw": {}}
