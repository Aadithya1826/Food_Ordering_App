from app.db import SessionLocal
from app.models.order import Order, OrderItem

db = SessionLocal()
orders = db.query(Order).order_by(Order.id.desc()).limit(5).all()
for o in orders:
    items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
    print(f"Order #{o.id}: amount={o.total_amount}, items={[i.menu_item_id for i in items]}")
