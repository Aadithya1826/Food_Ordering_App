import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.db import SessionLocal
from app.models.table import Table
from app.models.order import Order

db = SessionLocal()

tables = db.query(Table).filter(Table.status == "Occupied").all()

count = 0
for t in tables:
    active_order = db.query(Order).filter(
        Order.table_id == str(t.id),
        Order.status.notin_(["SERVED", "COMPLETED", "CANCELLED"])
    ).first()
    
    if not active_order:
        t.status = "Vacant"
        count += 1

db.commit()
print(f"Reset {count} stuck tables to Vacant.")
