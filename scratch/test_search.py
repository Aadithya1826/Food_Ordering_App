import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.db import SessionLocal
from backend.app.mcp.tools import search_menu_item

db = SessionLocal()

class MockUser:
    role = "SUPER_ADMIN"
    restaurant_id = 1

user = MockUser()
res = search_menu_item(db, user, "mushroom")
print("Mushroom search:", res)

res2 = search_menu_item(db, user, "schezwan mushroom")
print("Schezwan mushroom search:", res2)

res3 = search_menu_item(db, user, "Schezwan Mushroom Noodles")
print("Exact search:", res3)
