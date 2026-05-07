from backend.app.db import engine
from sqlalchemy import text

def add_column():
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE menu_items ADD COLUMN quantity INTEGER DEFAULT 0"))
            print("Column 'quantity' added successfully.")
        except Exception as e:
            if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                print("Column 'quantity' already exists.")
            else:
                print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_column()
