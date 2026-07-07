from backend.db import SessionLocal
from backend.app.models.order import Order, OrderItem
from backend.app.models.restaurant import Restaurant
from sqlalchemy import func, or_, and_

db = SessionLocal()
paid_condition = or_(
    func.lower(Order.payment_status) == "paid",
    and_(
        or_(Order.payment_status.is_(None), Order.payment_status == ""),
        Order.status.in_(["SERVED", "COMPLETED"])
    )
)

q = db.query(func.sum(Order.total_amount)).filter(paid_condition).scalar()
print("Success:", q)
