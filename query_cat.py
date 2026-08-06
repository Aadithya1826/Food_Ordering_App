import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://food_admin:foodadmin%40123@banking-db.cnkegcm24ikf.ap-south-2.rds.amazonaws.com:5432/food_ordering_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

cats = session.execute(text("SELECT id, name, restaurant_id FROM menu_categories")).fetchall()
print("Categories:", cats)
