import sys
sys.path.append('backend')
from app.db import SessionLocal
from app.routes.reports import get_reports
from app.models.user import User

class MockUser:
    def __init__(self, role, rest_id):
        self.role = role
        self.restaurant_id = rest_id

db = SessionLocal()
user = MockUser("SUPER_ADMIN", 1)

try:
    res = get_reports(restaurant_id=1, user=user, db=db)
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
