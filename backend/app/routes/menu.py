from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.menu import MenuItem, MenuCategory
from ..schemas.menu import MenuItemCreate, MenuItemResponse, MenuItemUpdate, MenuCategoryResponse
from ..utils.dependencies import get_current_user
from ..utils.roles import require_role, filter_by_user_restaurant

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET categories
@router.get("/api/v1/menu/categories", response_model=list[MenuCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(MenuCategory).all()

# GET items - with role-based filtering
@router.get("/api/v1/menu/items")
def get_items(
    request: Request,
    user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get menu items with role-based access control
    
    - SUPER_ADMIN: Sees items from all restaurants
    - HOTEL_ADMIN: Sees items only from their restaurant
    
    Authentication: Token can be provided in Authorization header OR cookie
    """
    require_role(user, ["HOTEL_ADMIN", "SUPER_ADMIN"])

    query = db.query(MenuItem)
    
    # Apply restaurant filter based on user role
    if user.role == "SUPER_ADMIN":
        # SUPER_ADMIN sees ALL items
        return query.all()
    else:
        # HOTEL_ADMIN sees only their restaurant's items
        return query.filter(MenuItem.restaurant_id == user.restaurant_id).all()

# POST item
@router.post("/api/v1/menu/items", response_model=MenuItemResponse)
def create_item(data: MenuItemCreate, db: Session = Depends(get_db)):
    item = MenuItem(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

# PATCH item - with role-based validation
@router.patch("/api/v1/menu/items/{item_id}", response_model=MenuItemResponse)
def update_item(request: Request, item_id: int, data: MenuItemUpdate, user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Update a menu item with proper authorization check
    
    - SUPER_ADMIN: Can update items from any restaurant
    - HOTEL_ADMIN: Can only update items from their restaurant
    """
    require_role(user, ["HOTEL_ADMIN", "SUPER_ADMIN"])
    
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Check restaurant access
    if user.role == "HOTEL_ADMIN" and item.restaurant_id != user.restaurant_id:
        raise HTTPException(
            status_code=403,
            detail=f"Access denied: This item belongs to restaurant {item.restaurant_id}, you can only access restaurant {user.restaurant_id}"
        )

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item