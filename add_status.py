import sys
sys.path.append('backend')
from app.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE tables ADD COLUMN status VARCHAR DEFAULT 'Vacant'"))
        conn.commit()
        print("Column 'status' added successfully.")
    except Exception as e:
        print("Error:", e)
