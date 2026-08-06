import requests

signup_url = "http://localhost:8000/api/v1/auth/signup"
signup_payload = {
    "name": "Test Cashier",
    "email": "testcashier123@dataudipi.com",
    "password": "password",
    "role": "CASHIER",
    "restaurant_id": 1
}
requests.post(signup_url, json=signup_payload)

login_url = "http://localhost:8000/api/v1/auth/login"
response = requests.post(login_url, json={"email": "testcashier123@dataudipi.com", "password": "password", "role": "CASHIER"})
print(f"Login response: {response.text}")
token = response.json().get("access_token")

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

headers = {"Authorization": f"Bearer {token}"}
response = requests.post(url, json=payload, headers=headers)
print(f"Status: {response.status_code}")
print(f"Body: {response.text}")
