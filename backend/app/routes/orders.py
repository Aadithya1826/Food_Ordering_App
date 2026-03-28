from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.order import Order, OrderItem
from ..schemas.order import OrderStatusUpdate, OrderResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET live orders
@router.get("/api/v1/orders/live", response_model=list[dict])
def get_live_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.status != "SERVED").all()

    response = []
    for o in orders:
        items = [
            {
                "name": i.menu_item.name,
                "quantity": i.quantity,
                "price": i.price
            }
            for i in o.items
        ]

        response.append({
            "order_id": o.id,
            "table_number": o.table.table_number,
            "status": o.status,
            "total_amount": o.total_amount,
            "created_at": o.created_at,
            "items": items
        })

    return response

# PATCH order status
@router.patch("/api/v1/orders/{order_id}/status", response_model=dict)
def update_status(order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = data.status
    db.commit()

    return {
        "order_id": order.id,
        "status": order.status
    }