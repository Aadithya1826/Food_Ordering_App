import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app.db import engine
from sqlalchemy import inspect

inspector = inspect(engine)
print("MenuCategory unique constraints:", inspector.get_unique_constraints("menu_categories"))
print("Table unique constraints:", inspector.get_unique_constraints("tables"))
