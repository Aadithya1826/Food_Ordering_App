# JWT Middleware & Authorization Documentation

## Overview
The JWT middleware now properly implements role-based access control with the following authorization rules:

### Authorization Rules

#### SUPER_ADMIN
- ✅ Can access ALL restaurants
- ✅ Can view menu items from ALL restaurants
- ✅ Can view inventory from ALL restaurants  
- ✅ No restaurant_id restriction

#### HOTEL_ADMIN
- ❌ Can ONLY access their assigned restaurant
- ✅ Can view menu items ONLY from their restaurant
- ✅ Can view inventory ONLY from their restaurant
- ✅ Must have a restaurant_id assigned
- ❌ Cannot access other restaurants' data

---

## Key Components

### 1. **JWT Middleware** (`backend/app/middleware/jwt_middleware.py`)
Provides centralized JWT token verification and restaurant access control:

**Functions:**
- `verify_jwt_token(token)` - Validates JWT token and extracts payload
- `get_user_from_token(token, db)` - Gets User object from token  
- `check_restaurant_access(user, restaurant_id)` - Validates restaurant access
- `get_user_restaurant_filter(user)` - Returns filter for queries

### 2. **Authorization Utilities** (`backend/app/utils/roles.py`)
Application-level authorization functions:

- `require_role(user, allowed_roles)` - Check if user has required role
- `require_restaurant_access(user, restaurant_id)` - Verify restaurant access
- `filter_by_user_restaurant(user, query)` - Apply restaurant filter to queries

### 3. **Dependencies** (`backend/app/utils/dependencies.py`)
FastAPI dependency for authentication:

- `get_current_user()` - Extract and validate authenticated user

---

## Authorization Flow Examples

### Scenario 1: SUPER_ADMIN Accessing Menu Items
```
Request: GET /api/v1/menu/items
Header: Authorization: Bearer <token>

1. get_current_user() extracts token
2. verify_jwt_token() decodes and validates JWT
3. get_user_from_token() retrieves User from database
4. require_role() confirms user is HOTEL_ADMIN or SUPER_ADMIN
5. Role check passes ✅
6. Restaurant filter check:
   - User is SUPER_ADMIN → NO FILTER applied
   - Returns items from ALL restaurants ✅
```

### Scenario 2: HOTEL_ADMIN Accessing Menu Items
```
Request: GET /api/v1/menu/items
Header: Authorization: Bearer <token>

1. get_current_user() extracts token
2. verify_jwt_token() decodes and validates JWT
3. get_user_from_token() retrieves User from database (restaurant_id = 5)
4. require_role() confirms user is HOTEL_ADMIN or SUPER_ADMIN
5. Role check passes ✅
6. Restaurant filter check:
   - User is HOTEL_ADMIN → FILTER by restaurant_id=5
   - Returns items ONLY from restaurant 5 ✅
```

### Scenario 3: HOTEL_ADMIN Accessing Other Restaurant's Items
```
Request: PATCH /api/v1/menu/items/123
Header: Authorization: Bearer <token>
Body: { "price": 299 }

1. get_current_user() validates user (restaurant_id = 5)
2. require_role() confirms HOTEL_ADMIN ✅
3. Query finds item with id=123 (belongs to restaurant 8)
4. check_restaurant_access():
   - User restaurant_id (5) != Item restaurant_id (8)
   - Raises HTTPException 403 Forbidden ❌
5. Access DENIED - Correct behavior ✅
```

### Scenario 4: SUPER_ADMIN Accessing Any Restaurant's Items
```
Request: PATCH /api/v1/menu/items/123
Header: Authorization: Bearer <token>
Body: { "price": 299 }

1. get_current_user() validates user (any restaurant)
2. require_role() confirms SUPER_ADMIN ✅
3. Query finds item with id=123
4. check_restaurant_access():
   - User is SUPER_ADMIN → Always returns True ✅
5. Item updated successfully ✅
```

---

## Issue Fixes Summary

### ❌ Previous Issues
1. **SuperAdmin limitation** - SuperAdmin was filtered by own restaurant_id
2. **No centralized middleware** - Authorization scattered across endpoints
3. **Inconsistent access control** - Same behavior for both roles
4. **Missing explicit validation** - Restaurant access wasn't verified

### ✅ Fixed With New Middleware
1. **SuperAdmin unrestricted** - `check_restaurant_access()` returns True for SUPER_ADMIN
2. **Centralized JWT handling** - All token validation in middleware
3. **Role-specific behavior** - Different filters applied based on role
4. **Explicit validation** - `check_restaurant_access()` validates every access

---

## Updated Routes

### GET /api/v1/menu/items
- **SUPER_ADMIN**: Returns ALL items from all restaurants
- **HOTEL_ADMIN**: Returns items from their restaurant only

### PATCH /api/v1/menu/items/{item_id}
- **SUPER_ADMIN**: Can update any item
- **HOTEL_ADMIN**: Can update items from their restaurant only

### GET /api/v1/inventory
- **SUPER_ADMIN**: Returns ALL inventory from all restaurants
- **HOTEL_ADMIN**: Returns inventory from their restaurant only

### PATCH /api/v1/inventory/{inventory_id}
- **SUPER_ADMIN**: Can update any item
- **HOTEL_ADMIN**: Can update items from their restaurant only

---

## Security Considerations

1. **Role validation** - Every endpoint checks user role
2. **Restaurant isolation** - HOTEL_ADMIN strictly isolated to their restaurant
3. **Explicit access control** - No implicit access (fail-closed pattern)
4. **Centralized verification** - Single source of truth for JWT validation
5. **Error messages** - Clear failure reasons for debugging

---

## Testing the Middleware

Run this test to verify authorization:
```python
from backend.app.middleware.jwt_middleware import check_restaurant_access, get_user_restaurant_filter

# Test SUPER_ADMIN (restaurant_id can be any value, it's ignored)
super_admin = MockUser(role="SUPER_ADMIN", restaurant_id=None)
check_restaurant_access(super_admin, 999)  # Returns True ✅

# Test HOTEL_ADMIN accessing own restaurant
hotel_admin = MockUser(role="HOTEL_ADMIN", restaurant_id=5)
check_restaurant_access(hotel_admin, 5)  # Returns True ✅

# Test HOTEL_ADMIN accessing other restaurant
hotel_admin = MockUser(role="HOTEL_ADMIN", restaurant_id=5)
check_restaurant_access(hotel_admin, 999)  # Raises HTTPException ❌
```
