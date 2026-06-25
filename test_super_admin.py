import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.user import User
from app.utils.auth import create_token
import requests
import json

db = SessionLocal()
super_admin = db.query(User).filter(User.role == 'SUPER_ADMIN').first()
if super_admin:
    token = create_token(super_admin)
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get("http://localhost:8000/api/v1/reports", headers=headers)
    print("Status Code:", res.status_code)
    data = res.json()
    print("Top Hotels:", json.dumps(data.get("top_hotels", []), indent=2))
else:
    print("No SUPER_ADMIN found")
