import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.models.order import Order, OrderItem
from app.models.menu import MenuItem

db = SessionLocal()
orders = db.query(Order).all()
print(f"Total orders in DB: {len(orders)}")
for o in orders:
    print(f"Order {o.id}: status={o.status}, payment={o.payment_status}, total={o.total_amount}")
