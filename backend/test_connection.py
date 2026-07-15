import requests

url = "https://api.misscultureglobalkenya.com/api/main/test-connection/"

try:
    response = requests.get(url, timeout=20)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
