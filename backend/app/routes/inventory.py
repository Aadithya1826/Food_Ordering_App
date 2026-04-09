from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.inventory import InventoryItem
from ..utils.dependencies import get_current_user
from ..utils.roles import require_role, resolve_restaurant_id, require_restaurant_access

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/v1/inventory")
def get_inventory(
    restaurant_id: int | None = None,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get inventory items with role-based access control

    - SUPER_ADMIN: Sees inventory from the selected restaurant or all restaurants if no restaurant_id is provided
    - HOTEL_ADMIN: Sees inventory only from their restaurant
    """
    require_role(user, ["HOTEL_ADMIN", "SUPER_ADMIN"])

    restaurant_id = resolve_restaurant_id(user, restaurant_id)
    query = db.query(InventoryItem)
    if restaurant_id is not None:
        query = query.filter(InventoryItem.restaurant_id == restaurant_id)

    return query.all()


@router.patch("/api/v1/inventory/{inventory_id}")
def update_inventory(
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

    require_restaurant_access(user, item.restaurant_id)

    if "quantity" not in data:
        raise HTTPException(status_code=400, detail="Quantity is required")

    item.quantity = data["quantity"]

    db.commit()
    db.refresh(item)

    return item