from sqlalchemy import Column, Integer, String, Float, ForeignKey
from ..db import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    name = Column(String)
    quantity = Column(Float)
    unit = Column(String)