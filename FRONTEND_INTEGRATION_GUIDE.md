# Frontend-Backend Integration Guide

## Overview

The React frontend is fully integrated with the FastAPI backend. This guide explains the architecture and how data flows between frontend and backend.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA UDIPI SYSTEM                            │
├──────────────────────────────┬──────────────────────────────────┤
│     Frontend (React)         │      Backend (FastAPI)            │
│                              │                                   │
│  Port: 3000                  │   Port: 8000                     │
│  • Login Page                │   • Auth Router                  │
│  • Role Selection            │   • Menu Router                  │
│  • Admin Dashboard           │   • Orders Router                │
│  • Hotel Manager Dashboard   │   • Restaurants Router           │
│  • Protected Routes          │   • Table Router                 │
│  • API Service               │   • Inventory Router             │
│  • Auth Context              │   • JWT Middleware               │
│  • Axios HTTP Client         │   • CORS Middleware              │
└──────────────────────────────┴──────────────────────────────────┘
              │                             │
              └─────────────────────────────┘
                   HTTP + JWT Token
```

---

## API Endpoints

### Authentication Endpoints

#### Login
```
POST /api/v1/auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "super_admin",
    "restaurant_id": null
  }
}
```

#### Logout
```
POST /api/v1/auth/logout

Response:
{
  "message": "Logged out successfully"
}
```

---

## Frontend Request Flow

### 1. Login Request Flow

```javascript
User enters credentials → Form Submit → API Service → Backend
                                          ↓
                                    JWT Token Returned
                                          ↓
                                 Token stored in localStorage
                                          ↓
                                 Update Auth Context
                                          ↓
                                  Navigate to Role Selection
```

### 2. Protected Route Access Flow

```javascript
User accesses protected page → Check Auth Context → Is Authenticated?
                                    ↓                    ↓
                               YES: Show Page        NO: Redirect to Login
```

### 3. API Request with Token

```javascript
Component makes API call → API Interceptor adds Token → Backend
                        (Authorization: Bearer <token>)
                                ↓
                        Backend verifies JWT
                                ↓
                        If valid: Process request
                        If invalid: Return 401 Unauthorized
```

---

## Code Examples

### Making API Requests

```jsx
import api from '../services/api';

// GET request
const fetchMenuItems = async () => {
  try {
    const response = await api.get('/api/v1/menu');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data?.detail);
  }
};

// POST request
const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/v1/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data?.detail);
  }
};
```

### Using Auth Context

```jsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Hello, {user.name}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           User Not Authenticated                │
│                                                 │
│          Navigate to Login Page                 │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │   Enter Email & Password   │
        │   Click Sign In            │
        └────────────┬───────────────┘
                     │
                     ↓
        ┌────────────────────────────┐
        │   Send POST /api/v1/...    │
        │   /auth/login              │
        └────────────┬───────────────┘
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
    ┌──────────────┐    ┌──────────────────┐
    │ Authentication
    │     Success  │    │ Authentication  │
    │              │    │      Failed     │
    └──────┬───────┘    └────────┬────────┘
           │                     │
           ↓                     ↓
    ┌──────────────┐    ┌──────────────────┐
    │ Store JWT    │    │ Show Error       │
    │ Token        │    │ Message          │
    └──────┬───────┘    └────────┬────────┘
           │                     │
           ↓                     ↓
    ┌──────────────┐    ┌──────────────────┐
    │ Update Auth  │    │ User can retry   │
    │ Context      │    │                  │
    └──────┬───────┘    └──────────────────┘
           │
           ↓
    ┌──────────────┐
    │ Redirect to  │
    │ Role         │
    │ Selection    │
    └──────┬───────┘
           │
           ↓
    ┌──────────────┐
    │ User         │
    │ Authenticated│
    └──────────────┘
```

---

## JWT Token Management

### Token Storage
```javascript
// Token is stored in localStorage
localStorage.getItem('access_token')
localStorage.getItem('user')
```

### Token Usage
```javascript
// Automatically added to requests
Authorization: Bearer <token>
```

### Token Expiration
- Backend: 30 minutes (configurable)
- Frontend: Auto-refresh on page load if token exists

### Token Removal
```javascript
// On logout
localStorage.removeItem('access_token');
localStorage.removeItem('user');
```

---

## CORS Configuration

The backend is configured to accept requests from:

```python
allow_origins=[
    "http://localhost:3000",     # React dev server
    "http://localhost:5173",     # Vite dev server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
```

Configure for production by updating `backend/app/main.py`:

```python
allow_origins=[
    "https://dataudipi.com",
    "https://www.dataudipi.com",
]
```

---

## Error Handling

### Frontend Error Handling

```jsx
try {
  await login(email, password);
} catch (error) {
  if (error.response?.status === 401) {
    showError("Invalid credentials");
  } else if (error.response?.status === 500) {
    showError("Server error. Try again later.");
  } else {
    showError("Network error");
  }
}
```

### Common Error Responses

| Status | Message | meaning |
|--------|---------|---------|
| 401 | User not found | Email not registered |
| 401 | Invalid password | Wrong password |
| 500 | Internal Server Error | Backend error |
| 403 | Forbidden | Insufficient permissions |

---

## Development Setup

### Start Backend
```bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

### Test Integration
1. Login at `http://localhost:3000`
2. Open DevTools → Network tab
3. Check API calls to `http://localhost:8000/api/v1/...`
4. Verify JWT token in request headers

---

## Frontend Service Layer

### api.js Structure

```javascript
// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export configured api instance
export default api;
export const authService = { login, logout, ... };
```

### Making Requests

```javascript
// AuthService methods
authService.login(email, password)
authService.logout()
authService.getCurrentUser()
authService.getToken()
authService.isAuthenticated()

// Direct API calls
api.get('/api/v1/endpoint')
api.post('/api/v1/endpoint', data)
api.put('/api/v1/endpoint/:id', data)
api.delete('/api/v1/endpoint/:id')
```

---

## Adding New API Endpoints

### Backend (FastAPI)

```python
# backend/app/routes/myfeature.py
from fastapi import APIRouter, Depends
from ..db import SessionLocal

router = APIRouter()

@router.get("/api/v1/myfeature")
async def get_feature(db = Depends(get_db)):
    return {"data": "example"}
```

### Frontend (React)

```javascript
// src/services/featureService.js
import api from './api';

export const featureService = {
  getFeature: async () => {
    const response = await api.get('/api/v1/myfeature');
    return response.data;
  }
};

// Use in component
import { featureService } from '../services/featureService';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    featureService.getFeature()
      .then(setData)
      .catch(console.error);
  }, []);

  return <div>{data?.data}</div>;
};
```

---

## Deploying to Production

### Frontend Deployment (Vercel/Netlify)

1. Update `.env.production` with production API URL
2. Build: `npm run build`
3. Deploy `dist/` folder to hosting

### Backend Deployment (Heroku/AWS)

1. Update CORS origins with frontend domain
2. Configure environment variables
3. Deploy with appropriate database

### Environment Variables

**Frontend (.env.production)**
```
VITE_API_URL=https://api.dataudipi.com
```

**Backend (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
API_DOMAIN=https://api.dataudipi.com
```

---

## Monitoring & Debugging

### Browser DevTools

1. **Network Tab**: Check all API requests
2. **Application Tab**: View localStorage and cookies
3. **Console**: Check for JavaScript errors

###  Backend Logs

```
INFO:     Application startup complete
INFO:     POST /api/v1/auth/login 200
INFO:     GET /api/v1/menu 200
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Check backend CORS configuration |
| 401 Unauthorized | Verify JWT token in localStorage |
| Network Error | Ensure backend is running |
| Token Not Saving | Check browser localStorage settings |
| Routes Not Loading | Clear cache and refresh page |

---

## Security Best Practices

- ✅ Never commit `.env` files with secrets
- ✅ Use HTTPS in production
- ✅ Set `secure=True` for cookies in production
- ✅ Implement refresh token mechanism
- ✅ Validate all inputs on backend
- ✅ Use strong JWT secrets (min 32 characters)
- ✅ Implement rate limiting on API
- ✅ Add request logging and monitoring

---

## Next Steps

1. **Extend API Endpoints**: Add more routes as needed
2. **Enhance Dashboards**: Build out dashboard features
3. **Add Data Visualization**: Use charts for analytics
4. **Implement Notifications**: Add real-time notifications
5. **Mobile Optimization**: Test on mobile devices
6. **Performance**: Optimize bundle size and API calls

---

## Support & Resources

- [React Documentation](https://react.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Axios Documentation](https://axios-http.com)
- [JWT.io](https://jwt.io)

Happy coding! 🚀
