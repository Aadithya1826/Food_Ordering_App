import sys
import os
import random

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app.db import SessionLocal
from backend.app.models.restaurant import Restaurant
from backend.app.models.menu import MenuCategory, MenuItem
from backend.app.models.table import Table

db = SessionLocal()

# Rename Restaurant 2
rest2 = db.query(Restaurant).filter(Restaurant.id == 2).first()
if rest2:
    rest2.name = "Grand Udipi Hotel"
    db.commit()
    print("Renamed restaurant 2 to Grand Udipi Hotel")
else:
    print("Restaurant 2 not found! Creating it...")
    rest2 = Restaurant(id=2, name="Grand Udipi Hotel", address="", phone="", email="")
    db.add(rest2)
    db.commit()

# Delete existing data for restaurant 2 to avoid duplicates
db.query(MenuItem).filter(MenuItem.restaurant_id == 2).delete()
db.query(MenuCategory).filter(MenuCategory.restaurant_id == 2).delete()
db.query(Table).filter(Table.restaurant_id == 2).delete()
db.commit()

# Replicate Categories
categories = db.query(MenuCategory).filter(MenuCategory.restaurant_id == 1).all()
cat_map = {}
for cat in categories:
    new_cat = MenuCategory(
        restaurant_id=2,
        name=cat.name + " (Grand Udipi)",  # append to avoid any potential name conflicts if they exist
        description=cat.description
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    cat_map[cat.id] = new_cat.id
print(f"Replicated {len(categories)} categories")

# Replicate Items
items = db.query(MenuItem).filter(MenuItem.restaurant_id == 1).all()
for item in items:
    new_item = MenuItem(
        restaurant_id=2,
        category_id=cat_map.get(item.category_id),
        item_code=item.item_code,
        name=item.name,
        description=item.description,
        price=item.price,
        quantity=item.quantity,
        is_available=item.is_available,
        is_deleted=item.is_deleted,
        image_url=item.image_url
    )
    db.add(new_item)
db.commit()
print(f"Replicated {len(items)} items")

# Replicate Tables
tables = db.query(Table).filter(Table.restaurant_id == 1).all()
for t in tables:
    new_table = Table(
        restaurant_id=2,
        table_number=t.table_number,
        capacity=t.capacity,
        status="Vacant",
        is_active=t.is_active,
        qr_code=f"https://grandudipi.com/dine-in?table=T-GRAND{random.randint(100000, 999999)}"
    )
    db.add(new_table)
db.commit()
print(f"Replicated {len(tables)} tables")

