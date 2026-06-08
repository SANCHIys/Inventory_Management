from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Products, Categories

router = APIRouter()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_products = db.query(Products).count()
    total_categories = db.query(Categories).count()
    low_stock = db.query(Products).filter(
        Products.quantity <= Products.low_stock_threshold
    ).count()
    all_products = db.query(Products).all()
    total_stock_value = sum(p.price * p.quantity for p in all_products)
    
    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "low_stock_count": low_stock,
        "total_stock_value": total_stock_value
    }