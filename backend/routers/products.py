from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Products
from schemas import ProductCreate, ProductResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=ProductResponse)
def create_product(products: ProductCreate, db: Session = Depends(get_db)):
    # 1. check if products sku already exists
    existing_product = db.query(Products).filter(Products.sku == products.sku).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="Product already registered")
    # 2. create new products object
    new_product = Products(
        name=products.name,
        sku=products.sku,
        price=products.price,
        quantity=products.quantity,
        low_stock_threshold=products.low_stock_threshold,
        category_id=products.category_id
    )
    
    # 3. save to db
    db.add(new_product)      # stage it
    db.commit()           # save it
    db.refresh(new_product)  # get the updated object back (with id)

    # 4. return
    return new_product

@router.get("/", response_model=List[ProductResponse])
def get_product(db: Session = Depends(get_db)):
    # just return all products
    return db.query(Products).all()

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Products).filter(Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.model_dump().items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Products).filter(Products.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}