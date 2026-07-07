from app.db import SessionLocal
from app.models.order import Order, OrderItem

db = SessionLocal()
orders = db.query(Order).filter(Order.id.in_([2137, 2134, 2095, 2013, 2170])).all()
for o in orders:
    items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
    print(f"Order #{o.id}: amount={o.total_amount}, status={o.status}, items={[i.menu_item_id for i in items]}")
