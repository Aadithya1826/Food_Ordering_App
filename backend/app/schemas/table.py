from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TableCreate(BaseModel):
    table_number: str
    qr_code: Optional[str] = None

class TableResponse(BaseModel):
    id: int
    restaurant_id: Optional[int]
    table_number: str
    qr_code: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TableUpdate(BaseModel):
    table_number: Optional[str] = None
    qr_code: Optional[str] = None
