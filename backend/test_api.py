import requests

url = "https://api.misscultureglobalkenya.com/api/main/contact/"
payload = {
    "name": "Test",
    "email": "test@test.com",
    "subject": "General Inquiry",
    "message": "test",
    "type": "general"
}

try:
    response = requests.post(url, json=payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
