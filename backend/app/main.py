from fastapi import FastAPI
from .routes import auth, menu, orders, table, inventory, restaurants
from .mcp import router as mcp_router

app = FastAPI()

app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(table.router)
app.include_router(inventory.router)
app.include_router(restaurants.router)
app.include_router(mcp_router)
