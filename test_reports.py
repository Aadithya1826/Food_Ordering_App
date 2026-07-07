from app.db import SessionLocal
from app.routes.reports import get_reports
from app.models.user import User

db = SessionLocal()
# find a super admin user
user = db.query(User).filter(User.role == "SUPER_ADMIN").first()

try:
    res = get_reports(restaurant_id=None, user=user, db=db)
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
