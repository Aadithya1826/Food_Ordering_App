import requests

url = "http://localhost:8000/api/v1/orders?restaurant_id=1"
payload = {
    "table_number": "takeaway",
    "payment_method": "Cash",
    "cart": [{"id": 1, "quantity": 1, "price": 100}],
    "subtotal": 100,
    "gst": 0,
    "service_charge": 0,
    "total_amount": 100
}

# We need a valid token. Let's create a dummy user token or use a known one.
# Wait, if we send it without auth, it should return 401 Unauthorized, not 500!
# If it returns 500 without auth, then it's failing BEFORE auth or auth is failing with 500.

response = requests.post(url, json=payload)
print(f"Status: {response.status_code}")
print(f"Body: {response.text}")
