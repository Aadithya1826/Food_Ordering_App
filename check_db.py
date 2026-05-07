import sys
from sqlalchemy import create_engine, text
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://food_admin:foodadmin%40123@banking-db.cnkegcm24ikf.ap-south-2.rds.amazonaws.com:5432/food_ordering_db",
)

engine = create_engine(DATABASE_URL)
with engine.connect() as conn:
    result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='inventory_items'"))
    cols = [r[0] for r in result]
    print("Columns in inventory_items:", cols)
