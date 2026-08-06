import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.db import SessionLocal
from sqlalchemy import text

def add_column():
    db = SessionLocal()
    try:
        # Add column if not exists
        db.execute(text("ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS report_date DATE"))
        
        # Backfill existing records with their updated_at date or today
        db.execute(text("UPDATE inventory_items SET report_date = DATE(updated_at) WHERE report_date IS NULL"))
        
        db.commit()
        print("Successfully added and backfilled report_date column to inventory_items")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_column()
