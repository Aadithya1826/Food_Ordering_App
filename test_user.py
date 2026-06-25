import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).filter(User.name.like('%Marimuthu%')).first()
if user:
    print(f"User: {user.name}, role: {user.role}, rest_id: {user.restaurant_id}")
else:
    print("User not found")
