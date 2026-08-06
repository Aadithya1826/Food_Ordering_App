import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app.db import engine
from sqlalchemy import inspect

inspector = inspect(engine)
print("MenuCategory indexes:", inspector.get_indexes("menu_categories"))
print("Table indexes:", inspector.get_indexes("tables"))
