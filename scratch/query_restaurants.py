import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.app.db import SessionLocal
from backend.app.models.restaurant import Restaurant

db = SessionLocal()
rests = db.query(Restaurant).all()
for r in rests:
    print(f"ID: {r.id}, Name: {r.name}")
