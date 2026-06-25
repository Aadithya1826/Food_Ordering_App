import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.user import User
from app.utils.auth import create_token
import json
import requests

db = SessionLocal()
user = db.query(User).filter(User.name.like('%Marimuthu%')).first()
token = create_token(user)
headers = {"Authorization": f"Bearer {token}"}

res = requests.get("http://localhost:8000/api/v1/orders/live?restaurant_id=1", headers=headers)
print("Live orders status:", res.status_code)
print(json.dumps(res.json(), indent=2))
