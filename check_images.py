from app.db import SessionLocal
from app.models.menu import MenuItem

db = SessionLocal()
item = db.query(MenuItem).filter(MenuItem.image_url.isnot(None)).first()
if item:
    print(item.image_url)
else:
    print("No images found.")
