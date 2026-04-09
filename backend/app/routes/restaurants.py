from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.restaurant import Restaurant
from ..schemas.restaurant import RestaurantResponse
from ..utils.dependencies import get_current_user
from ..utils.roles import require_role, require_restaurant_access

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/api/v1/restaurants", response_model=list[RestaurantResponse])
def list_restaurants(user = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    List all restaurants for SUPER_ADMIN.

    HOTEL_ADMIN does not use this endpoint; they are tied to their own restaurant.
    """
    require_role(user, ["SUPER_ADMIN"])
    return db.query(Restaurant).all()


@router.get("/api/v1/restaurants/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    require_restaurant_access(user, restaurant_id)
    return restaurant
