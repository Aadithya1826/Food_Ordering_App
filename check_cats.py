import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://food_admin:foodadmin%40123@banking-db.cnkegcm24ikf.ap-south-2.rds.amazonaws.com:5432/food_ordering_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

print("--- Checking Categories 1-8 ---")
cats = session.execute(text("SELECT id, name FROM menu_categories WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8)")).fetchall()
print(cats)
