import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.db import SessionLocal
from sqlalchemy import text

db = SessionLocal()
result = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'inventory_items'"))
for row in result:
    print(row)
