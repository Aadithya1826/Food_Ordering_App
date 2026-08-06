import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("No database url")
    sys.exit(1)

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

try:
    from app.models.table import Table
    tables = session.query(Table).all()
    for t in tables:
        print(f"ID: {t.id} | Num: '{t.table_number}' | Status: {t.status} | Res: {t.restaurant_id}")
except Exception as e:
    print("Error:", e)

