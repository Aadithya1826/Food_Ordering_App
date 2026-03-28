from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.inventory import InventoryItem
from ..utils.dependencies import get_current_user
from ..utils.roles import require_role

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/v1/inventory")
def get_inventory(
    request: Request,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get inventory items with role-based access control
    
    - SUPER_ADMIN: Sees inventory from all restaurants
    - HOTEL_ADMIN: Sees inventory only from their restaurant
    """
    require_role(user, ["HOTEL_ADMIN", "SUPER_ADMIN"])

    query = db.query(InventoryItem)
    
    # Apply restaurant filter based on user role
    if user.role == "SUPER_ADMIN":
        # SUPER_ADMIN sees ALL inventory items
        return query.all()
    else:
        # HOTEL_ADMIN sees only their restaurant's inventory
        return query.filter(InventoryItem.restaurant_id == user.restaurant_id).all()


@router.patch("/api/v1/inventory/{inventory_id}")
def update_inventory(
    request: Request,
    inventory_id: int,
    data: dict,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update inventory item with authorization check
    
    - SUPER_ADMIN: Can update items from any restaurant
    - HOTEL_ADMIN: Can only update items from their restaurant
    """
    require_role(user, ["HOTEL_ADMIN", "SUPER_ADMIN"])
    
    item = db.query(InventoryItem).filter(InventoryItem.id == inventory_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Check restaurant access for HOTEL_ADMIN
    if user.role == "HOTEL_ADMIN" and item.restaurant_id != user.restaurant_id:
        raise HTTPException(
            status_code=403,
            detail=f"Access denied: This item belongs to restaurant {item.restaurant_id}, you can only access restaurant {user.restaurant_id}"
        )

    if "quantity" not in data:
        raise HTTPException(status_code=400, detail="Quantity is required")

    item.quantity = data["quantity"]

    db.commit()
    db.refresh(item)

    return item