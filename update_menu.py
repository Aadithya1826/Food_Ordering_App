import os
import random
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://food_admin:foodadmin%40123@banking-db.cnkegcm24ikf.ap-south-2.rds.amazonaws.com:5432/food_ordering_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Soft delete all existing items
session.execute(text("UPDATE menu_items SET is_deleted = true"))
session.commit()
print("Soft deleted existing items.")

# We don't delete categories to prevent foreign key errors with old items. 
# We'll just create new ones with a unique prefix to avoid UNIQUE constraints on category name.
# Or better, just prefix with a unique identifier if needed, or if the name already exists, reuse it!

south_indian = [
    ("Breakfast & Dinner", [
        ("Idly (2)", 40.00), ("Sambar Idly (2)", 60.00), ("Spl Mini Sambar Idly", 65.00),
        ("Vadai", 30.00), ("Pongal", 70.00), ("Sambar Vadai (1)", 40.00), ("Curd Vadai (1)", 40.00),
        ("Spl Vada", 35.00), ("Poori Masala", 80.00), ("Special Soda Dosai", 70.00),
        ("Special Masala Dosai", 80.00), ("Rava Dosai", 85.00), ("Idiyappam with Kurma", 70.00),
        ("Podi Idly", 65.00), ("Idly Vadacurry", 60.00), ("Dosa Vadacurry", 80.00),
        ("Poori Vadacurry", 90.00), ("Idiyappam Vadacurry", 75.00), ("Kuli Paniyaram", 60.00),
        ("Appam (1)", 40.00), ("Onion Dosai", 100.00), ("Onion Rava Dosai", 100.00),
        ("Onion Masala Dosai", 115.00), ("Ghee Dosai", 120.00), ("Ghee Roast Masala Dosai", 130.00),
        ("Paper Roast", 130.00), ("Plain Uthappam", 80.00), ("Onion Uthappam", 100.00),
        ("Tomato Uthappam", 110.00), ("Peas Uthappam", 110.00), ("Coconut Uthappam", 110.00),
        ("Parota Veg. Kuruma", 80.00), ("Chappathi Kuruma", 70.00), ("Mini Tiffen", 110.00),
        ("Kera Dosai", 125.00), ("Veg. Dosai", 135.00), ("Podi Dosai", 80.00),
        ("Gobi Mushroom Dosai", 135.00), ("Paneer Dosai", 135.00), ("Gobi Masala Dosai", 135.00),
        ("Dimond Dosai", 135.00), ("Mushroom Masala Dosai", 135.00), ("Paneer Mushroom Masala Dosai", 135.00),
        ("Chilly Paneer Dosai", 135.00)
    ]),
    ("Evening Snacks", [
        ("Baji (4)", 40.00), ("Bonda (2)", 35.00), ("Chola Poori", 80.00),
        ("Chilly Parota", 175.00), ("Kaima Idly (2)", 165.00)
    ]),
    ("Hot Beverages", [
        ("Coffee", 35.00), ("Milk", 35.00), ("Boost / Horlicks", 40.00), ("Tea", 35.00)
    ]),
    ("Dosa Varities", [
        ("Raagi Dosa (1 pc)", 45.00), ("Cholam Dosa (1 pc)", 45.00), ("Kambu Dosa (1 pc)", 45.00),
        ("Wheat Dosa (1 pc)", 45.00), ("Set Dosa (2 pcs) with Vadacurry", 75.00),
        ("Neer Dosa with Jaggery & Coconut", 75.00), ("Mysore Masala Dosa", 75.00)
    ]),
    ("Rice Varities", [
        ("Schezwan Fried Rice", 175.00), ("Schezwan Mushroom Rice", 180.00),
        ("Schezwan Paneer Rice", 180.00), ("Schezwan Gobi Rice", 180.00),
        ("Schezwan Noodles", 165.00), ("Schezwan Mushroom Noodles", 180.00),
        ("Schezwan Gobi Noodles", 180.00)
    ]),
    ("Soups", [
        ("Tomato Soup", 65.00), ("Onion Soup", 65.00), ("Veg. Soup", 65.00),
        ("Green Peas Soup", 65.00), ("Sweet Corn Soup", 65.00),
        ("Sweet Corn Veg. Soup", 65.00), ("Mushroom Soup", 65.00)
    ]),
    ("Lunch", [
        ("Unlimited Meals", 125.00), ("Parcel Meals", 130.00), ("Curd Rice", 60.00),
        ("Sambar Rice", 60.00), ("Quick Lunch", 120.00), ("Variety Rice", 60.00),
        ("Brinji Kuruma", 60.00), ("Lemon Rice", 60.00), ("Puli Rice", 60.00)
    ])
]

north_indian = [
    ("Salad", [
        ("Tomato Salad", 65.00), ("Veg. Salad", 65.00), ("Cucumber Salad", 65.00),
        ("Fruit Salad", 115.00), ("Onion Salad", 65.00)
    ]),
    ("Raitha", [
        ("Onion Raitha", 65.00), ("Veg. Raitha", 65.00), ("Tomato Raitha", 65.00), ("Extra Curd", 35.00)
    ]),
    ("Tandoori Breads", [
        ("Nan", 30.00), ("Veg. Nan", 75.00), ("Stuffed Nan", 75.00), ("Butter Nan", 35.00),
        ("Paneer Nan", 70.00), ("Kashmiri Nan", 80.00), ("Jeera Nan", 60.00), ("Roti", 30.00),
        ("Butter Roti", 35.00), ("Kulcha", 55.00), ("Masala Kulcha", 65.00), ("Stuffed Paratha", 60.00),
        ("Aloo Paratha", 60.00), ("Plain Paratha", 60.00), ("Pudina Paratha", 60.00),
        ("Peas Paratha", 60.00), ("Pulkha", 20.00)
    ]),
    ("Tandoori Starters", [
        ("Papad", 30.00), ("Masala Fry Papad", 40.00), ("Gobi-65", 160.00),
        ("Finger Chips", 165.00), ("Paneer-65", 170.00), ("Mushroom-65", 170.00)
    ]),
    ("Tandoori Side Dishes", [
        ("Aloo Fry", 165.00), ("Aloo Gobi", 165.00), ("Aloo Mutter", 165.00),
        ("Aloo Paneer", 170.00), ("Aloo Tikka Masala", 170.00), ("Aloo Capsicum", 170.00),
        ("Bindi Fry", 170.00), ("Bindi Masala", 170.00), ("Baby Corn Mushroom Masala", 175.00),
        ("Channa Masala", 160.00), ("Channa Paneer", 175.00), ("Gobi Paneer", 180.00),
        ("Gobi Mushroom Fry", 180.00), ("Gobi Masala", 165.00), ("Gobi Paneer Masala", 180.00),
        ("Gobi Mutter", 175.00), ("Gobi Tikka Masala", 175.00), ("Gobi Chilly Fry", 160.00),
        ("Gobi Mushroom Masala", 180.00), ("Gobi Munchurian", 160.00),
        ("Paneer Mutter", 185.00), ("Paneer Butter Masala", 185.00), ("Paneer Koftha", 185.00),
        ("Paneer Manchurian", 170.00), ("Paneer Masala", 180.00), ("Paneer Fry", 185.00),
        ("Paneer Mushroom Masala", 185.00), ("Paneer Tikka Masala", 185.00),
        ("Paneer Capsicum Masala", 185.00), ("Malai Koftha", 175.00), ("Veg. Koftha", 160.00),
        ("Veg. Curry", 160.00), ("Veg. Chilly Fry", 160.00), ("Veg. Manchurian", 160.00),
        ("Stuffed Tomato", 160.00), ("Stuffed Capsicum", 160.00), ("Tomato Onion Fry", 160.00),
        ("Green Peas Masala", 160.00), ("Kaju Masala", 200.00), ("Mushroom Masala", 180.00),
        ("Mushroom Fry", 180.00), ("Mushroom Manchurian", 180.00), ("Mushroom Pepper Salt", 180.00),
        ("Mixed Veg Kuruma", 170.00), ("Navarathna Kuruma", 185.00)
    ]),
    ("Noodles", [
        ("Veg. Noodles", 150.00), ("Veg. Fried Noodles", 170.00), ("Mushroom Noodles", 175.00),
        ("Singapore Noodles", 190.00), ("Veg. American Chopse", 190.00), ("Veg. Chinese Chopse", 190.00)
    ]),
    ("Rice Varities (North Indian)", [
        ("Veg. Biryani / Onion Raitha", 100.00), ("Veg. Fried Rice", 150.00),
        ("Peas Fried Rice", 160.00), ("Gobi Fried Rice", 160.00), ("Paneer Fried Rice", 165.00),
        ("Mushroom Fried Rice", 165.00), ("Garlic Fried Rice", 165.00), ("Veg. Pulav / Onion Raitha", 110.00),
        ("Gobi Pulav", 160.00), ("Paneer Pulav", 165.00), ("Jeera Pulav", 165.00),
        ("Ghee Pulav", 165.00), ("Peas Pulav", 165.00), ("Kashmiri Pulav", 190.00),
        ("Cashewnut Pulav", 190.00), ("Kaju Paneer Pulav", 190.00)
    ])
]

restaurants = [
    (1, "Mugalivakkam"),
    (2, "MGR Nagar")
]

for rest_id, suffix in restaurants:
    for data, region in [(south_indian, "South Indian"), (north_indian, "North Indian")]:
        for cat_name, items in data:
            unique_cat_name = f"{cat_name} ({suffix})"
            
            # Check if category exists
            cat_result = session.execute(
                text("SELECT id FROM menu_categories WHERE name = :name"),
                {"name": unique_cat_name}
            ).fetchone()
            
            if cat_result:
                cat_id = cat_result[0]
                # Update description to region
                session.execute(
                    text("UPDATE menu_categories SET description = :desc WHERE id = :id"),
                    {"desc": region, "id": cat_id}
                )
            else:
                session.execute(
                    text("""
                        INSERT INTO menu_categories (restaurant_id, name, description, created_at) 
                        VALUES (:rid, :name, :desc, NOW())
                    """),
                    {"rid": rest_id, "name": unique_cat_name, "desc": region}
                )
                cat_result = session.execute(
                    text("SELECT id FROM menu_categories WHERE name = :name"),
                    {"name": unique_cat_name}
                ).fetchone()
                cat_id = cat_result[0]
            
            # Insert items
            for item_name, price in items:
                session.execute(
                    text("""
                        INSERT INTO menu_items (restaurant_id, category_id, name, price, quantity, is_available, is_deleted, created_at)
                        VALUES (:rid, :cid, :name, :price, 999, true, false, NOW())
                    """),
                    {"rid": rest_id, "cid": cat_id, "name": item_name, "price": price}
                )

session.commit()
print("Menu successfully populated.")
