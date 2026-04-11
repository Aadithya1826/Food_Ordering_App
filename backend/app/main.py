from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, menu, orders, table, inventory, restaurants
from .mcp import router as mcp_router

app = FastAPI()

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # React development server
        "http://localhost:5173",     # Vite development server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(table.router)
app.include_router(inventory.router)
app.include_router(restaurants.router)
app.include_router(mcp_router)
