import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.environ.get("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

from app.models.table import Table
from app.models.order import Order

try:
    restaurants = session.query(Table.restaurant_id).distinct().all()
    
    for res in restaurants:
        res_id = res[0]
        tables = session.query(Table).filter(Table.restaurant_id == res_id).all()
        
        # Group by normalized name
        groups = {}
        for t in tables:
            norm = t.table_number.replace("T-", "").strip()
            if norm not in groups:
                groups[norm] = []
            groups[norm].append(t)
            
        for norm, t_list in groups.items():
            if len(t_list) > 1:
                print(f"Found duplicates for '{norm}' in restaurant {res_id}: {[t.table_number for t in t_list]}")
                # Prefer 'T-' prefix as primary, else the first one
                primary = None
                for t in t_list:
                    if t.table_number.startswith("T-"):
                        primary = t
                        break
                if not primary:
                    primary = t_list[0]
                    
                for t in t_list:
                    if t.id != primary.id:
                        print(f"  Merging orders from table {t.table_number} (ID: {t.id}) to {primary.table_number} (ID: {primary.id})")
                        session.execute(text(f"UPDATE orders SET table_id = '{primary.id}' WHERE table_id = '{t.id}'"))
                        
                        if t.status.lower() == "occupied":
                            primary.status = "Occupied"
                        
                        print(f"  Deleting table {t.table_number} (ID: {t.id})")
                        session.execute(text(f"DELETE FROM tables WHERE id = {t.id}"))
                        
    session.commit()
    print("Merge complete.")
    
except Exception as e:
    session.rollback()
    print("Error:", e)
