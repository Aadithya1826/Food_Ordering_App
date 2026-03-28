from fastapi import FastAPI
from .routes import auth, menu, orders, table, inventory



app = FastAPI()

app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(table.router)
app.include_router(inventory.router)
