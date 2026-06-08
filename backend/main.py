from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import auth, categories, products, stock, dashboard
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(categories.router, prefix="/categories", tags=["categories"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(stock.router, prefix="/stock", tags=["stock"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

@app.get("/")
def root():
    return {"message": "Inventory API Running"}