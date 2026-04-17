from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RestaurantCreateRequest(BaseModel):
    name: str
    address: Optional[str] = None
    phone: Optional[str] = None


class RestaurantResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    phone: Optional[str]
    created_at: datetime
    manager_name: Optional[str] = None

    class Config:
        from_attributes = True
