# Authentication Guide for Food Ordering API

## 🔐 How to Access Menu Items

The `/api/v1/menu/items` endpoint requires authentication. You **MUST** include a JWT token in the Authorization header.

### Error You're Getting
```
401 Unauthorized
{
  "detail": "Not authenticated"
}
```

**Why?** Because you're not sending the JWT token.

---

## ✅ Correct Way to Access

### Step 1: Login to Get Token

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'accept: application/json' \
  -d '{
    "email": "manager@dataudipi.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsInJvbGUiOiJIT1RFTF9BRE1JTiIsInJlc3RhdXJhbnRfaWQiOjEsImV4cCI6MTc3NDU5ODk3OX0.-j69OVWOZM5h6pRBQt5fnh7LHhox7Wi91NOAGaGqf48",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "name": "Udipi Manager",
    "role": "HOTEL_ADMIN",
    "restaurant_id": 1
  }
}
```

### Step 2: Copy the access_token and Use in Next Request

```bash
curl -X GET http://localhost:8000/api/v1/menu/items \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsInJvbGUiOiJIT1RFTF9BRE1JTiIsInJlc3RhdXJhbnRfaWQiOjEsImV4cCI6MTc3NDU5ODk3OX0.-j69OVWOZM5h6pRBQt5fnh7LHhox7Wi91NOAGaGqf48'
```

**Response (200 OK):**
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
  ...more items...
]
```

---

## 🔑 Credentials

### HOTEL_ADMIN (Restaurant 1)
```
Email: manager@dataudipi.com
Password: admin123
Restaurant ID: 1
Access: Can see 53 items from restaurant 1
```

### SUPER_ADMIN (All Restaurants)
```
Email: admin@foodapp.com
Password: super123
Restaurant ID: None
Access: Can see 54 items from ALL restaurants
```

---

## 📋 Using in Postman / Thunder Client / REST Client

### 1. Login Request
```
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "email": "manager@dataudipi.com",
  "password": "admin123"
}
```

### 2. Menu Items Request (with token from Step 1)
```
GET http://localhost:8000/api/v1/menu/items
Authorization: Bearer <copy_access_token_from_step_1>
Accept: application/json
```

---

## ❌ Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| No Authorization header | `Authorization: Bearer <token>` |
| `Authorization: <token>` | `Authorization: Bearer <token>` |
| `auth: <token>` | `Authorization: Bearer <token>` |
| `Bearer<token>` (no space) | `Bearer <token>` (with space) |
| Forgot to login first | Login first, then copy token |
| Token from another user | Use token from current login |

---

## 🎯 Quick Reference

**Authorization Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsInJvbGUiOiJIT1RFTF9BRE1JTiIsInJlc3RhdXJhbnRfaWQiOjEsImV4cCI6MTc3NDU5ODk3OX0.-j69OVWOZM5h6pRBQt5fnh7LHhox7Wi91NOAGaGqf48
```

**Parts:**
- `Authorization:` - Header name
- `Bearer` - Token type (required)
- Space - Important!
- `eyJhbGciOiJIUzI1NiI...` - Your JWT token from login

---

## 📊 Expected Results

### HOTEL_ADMIN Response
- **Status:** 200 OK
- **Items:** 53 menu items (from restaurant 1)
- **Restaurant Filter:** Only items with restaurant_id = 1

### SUPER_ADMIN Response
- **Status:** 200 OK
- **Items:** 54 menu items (from ALL restaurants)
- **Restaurant Filter:** None (sees everything)

---

## ✅ Verification Checklist

- [ ] Login successful (got access_token)
- [ ] Copied full access_token value
- [ ] Added "Bearer " prefix before token
- [ ] Authorization header is spelled correctly
- [ ] Space between "Bearer" and token
- [ ] Using the token from most recent login
- [ ] Token not expired
- [ ] Accept header is "application/json"

If you follow these steps, you should get **200 OK** with menu items! 🎉
