import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.user import User
import requests

# Get user
db = SessionLocal()
user = db.query(User).filter(User.name.like('%Marimuthu%')).first()

# Login to get real token
res = requests.post("http://localhost:8000/api/v1/auth/login", json={
    "email": user.email,
    "password": "password" # Wait, I don't know his password.
})
print("Login status:", res.status_code)
