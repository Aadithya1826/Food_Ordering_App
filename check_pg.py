import sys
sys.path.append('backend')
from app.db import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tables';"))
    for row in res:
        print(row)
