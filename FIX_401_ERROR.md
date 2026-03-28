# 401 Unauthorized Error - Solution

## 🔴 Problem You're Facing

```
GET http://localhost:8000/api/v1/menu/items
Headers: accept: application/json

Response: 401 Unauthorized
{
  "detail": "Not authenticated"
}
```

## ✅ Why This Happens

The `/api/v1/menu/items` endpoint **requires authentication**. 

You're calling it **without** the required `Authorization` header that contains a JWT token.

## 🔧 How to Fix It

### Option 1: Using cURL

```bash
# Step 1: Login to get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "manager@dataudipi.com",
    "password": "admin123"
  }'

# Copy the "access_token" from the response

# Step 2: Use the token to access menu items
curl -X GET http://localhost:8000/api/v1/menu/items \
  -H 'Authorization: Bearer <PASTE_ACCESS_TOKEN_HERE>' \
  -H 'accept: application/json'
```

### Option 2: Using Postman

**Request 1: Login**
```
Method: POST
URL: http://localhost:8000/api/v1/auth/login
Body (JSON):
{
  "email": "manager@dataudipi.com",
  "password": "admin123"
}
```
Click Send → Copy the `access_token` value

**Request 2: Get Menu Items**
```
Method: GET
URL: http://localhost:8000/api/v1/menu/items

Headers:
Key: Authorization
Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsInJvbGUiOiJIT1RFTF9BRE1JTiIsInJlc3RhdXJhbnRfaWQiOjEsImV4cCI6MTc3NDU5OTAzOX0.RngyBaZoM5lWM51uJf6--QBzEdjwXBPN-IVuQ5Dlm1g

Key: Accept
Value: application/json
```
Click Send → You'll get 200 OK with menu items

### Option 3: Using Thunder Client (VS Code)

**Request 1: Login**
- Method: `POST`
- URL: `http://localhost:8000/api/v1/auth/login`
- Body: `{ "email": "manager@dataudipi.com", "password": "admin123" }`
- Send → Copy access_token

**Request 2: Menu Items**
- Method: `GET`
- URL: `http://localhost:8000/api/v1/menu/items`
- Headers Tab:
  - `Authorization: Bearer <access_token>`
  - `Accept: application/json`
- Send → Get 200 OK

### Option 4: Using VS Code REST Client Extension

Create a file `requests.http`:

```http
### Login (HOTEL_ADMIN)
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "email": "manager@dataudipi.com",
  "password": "admin123"
}

### Get Menu Items with Token
GET http://localhost:8000/api/v1/menu/items
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsInJvbGUiOiJIT1RFTF9BRE1JTiIsInJlc3RhdXJhbnRfaWQiOjEsImV4cCI6MTc3NDU5OTAzOX0.RngyBaZoM5lWM51uJf6--QBzEdjwXBPN-IVuQ5Dlm1g
Accept: application/json
```

Click "Send Request" above each one.

---

## 📝 Test Credentials

### HOTEL_ADMIN (Can access Restaurant 1 only)
```
Email: manager@dataudipi.com
Password: admin123
Get: 53 menu items from restaurant 1
```

### SUPER_ADMIN (Can access all restaurants)
```
Email: admin@foodapp.com
Password: super123
Get: 54 menu items from ALL restaurants
```

---

## 🎯 Key Points

1. **Authentication is REQUIRED** for `/api/v1/menu/items`
2. **Always login first** to get the token
3. **Copy the full access_token** from login response
4. **Add the Authorization header** with format: `Bearer <token>`
5. **Space matters**: `Bearer ` (with space) then token
6. **Token expires** (1 hour by default) - login again if expired

---

## ✅ Expected Response (200 OK)

```json
[
  {
    "id": 16,
    "name": "Jeera Nan",
    "description": "Nan with jeera",
    "price": 60.0,
    "category_id": 1,
    "is_available": true
  },
  {
    "id": 17,
    "name": "Roti",
    "description": "Plain Roti",
    "price": 30.0,
    "category_id": 1,
    "is_available": true
  },
  ... 51 more items ...
]
```

---

## ❌ Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| No Authorization header | `Authorization: Bearer <token>` |
| `auth: <token>` | `Authorization: Bearer <token>` |
| `Bearer<token>` | `Bearer <token>` (space required) |
| `<token>` | `Bearer <token>` |
| Forgot to login | Login first, then copy token |
| Expired token | Login again to get new token |
| Wrong password in login | Use correct credentials |
| Forgot "Bearer" prefix | Must include "Bearer" |

---

## 🚀 Next Steps

1. ✅ Login to get access_token
2. ✅ Copy the full token value
3. ✅ Add `Authorization: Bearer <token>` header
4. ✅ Call `/api/v1/menu/items`
5. ✅ Get 200 OK with menu items!

**You're all set! The authorization is working perfectly.** 🎉
