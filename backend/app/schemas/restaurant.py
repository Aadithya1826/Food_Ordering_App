from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RestaurantResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    phone: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
