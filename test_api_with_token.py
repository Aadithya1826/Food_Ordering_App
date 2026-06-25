import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.user import User
from app.utils.auth import create_access_token
import requests

db = SessionLocal()
user = db.query(User).filter(User.role == 'HOTEL_ADMIN').first()
if user:
    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test live orders
    res_orders = requests.get(f"http://localhost:8000/api/v1/orders/live?restaurant_id={user.restaurant_id}", headers=headers)
    print("Live orders status:", res_orders.status_code)
    print("Live orders resp:", res_orders.text[:200])
    
    # Test reports
    res_reports = requests.get(f"http://localhost:8000/api/v1/reports?restaurant_id={user.restaurant_id}", headers=headers)
    print("Reports status:", res_reports.status_code)
    print("Reports resp:", res_reports.text[:200])
else:
    print("No HOTEL_ADMIN user found")
