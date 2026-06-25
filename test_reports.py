import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.routes.reports import get_reports
from fastapi import Request

db = SessionLocal()

# We can't directly call get_reports because it requires 'user' dependency.
# So let's replicate the logic for restaurant_id=1
from app.models.order import Order
from sqlalchemy import func
from datetime import datetime, timedelta

today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
print(f"Today start UTC: {today_start}")
q = db.query(func.sum(Order.total_amount)).filter(func.lower(Order.payment_status) == "paid")
q = q.filter(Order.restaurant_id == 1)
q = q.filter(Order.created_at >= today_start)
rev = q.scalar() or 0.0
print(f"Revenue today: {rev}")

base_q = db.query(Order).filter(func.lower(Order.payment_status) == "paid")
base_q = base_q.filter(Order.restaurant_id == 1)
today_orders = base_q.filter(Order.created_at >= today_start).count()
print(f"Today orders: {today_orders}")
