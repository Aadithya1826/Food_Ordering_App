import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.order import Order
from datetime import datetime

db = SessionLocal()
orders = db.query(Order).all()
for o in orders:
    print(f"Order {o.id}: created_at={o.created_at}")
