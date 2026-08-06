import sys
import os
from sqlalchemy import create_engine, text

engine = create_engine("postgresql://food_admin:foodadmin%40123@banking-db.cnkegcm24ikf.ap-south-2.rds.amazonaws.com:5432/food_ordering_db")
with engine.connect() as conn:
    res = conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = 'userrole'"))
    print([r[0] for r in res])
    try:
        conn.execute(text("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check"))
        conn.commit()
        print("Dropped users_role_check constraint")
    except Exception as e:
        print("Could not drop constraint:", e)
