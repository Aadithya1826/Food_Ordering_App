import sys
import os
from datetime import date
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.db import SessionLocal
from app.models.inventory import InventoryItem

db = SessionLocal()
# Test distinct on
query = db.query(InventoryItem).distinct(InventoryItem.name).order_by(InventoryItem.name, InventoryItem.report_date.desc()).all()
for row in query:
    print(row.name, row.report_date, row.balance)
