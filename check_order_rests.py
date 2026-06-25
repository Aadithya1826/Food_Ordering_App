import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.order import Order

db = SessionLocal()
orders = db.query(Order).all()
for o in orders:
    print(f"Order {o.id}: rest_id={o.restaurant_id} status={o.status}")
