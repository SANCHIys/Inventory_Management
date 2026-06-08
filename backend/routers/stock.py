from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Stock_movements,Products
from schemas import StockMovementCreate,StockMovementResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=StockMovementResponse)
def adjust_stock(movement: StockMovementCreate, db: Session = Depends(get_db)):
    product = db.query(Products).filter(Products.id == movement.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if movement.type == "stock_in":
        product.quantity += movement.quantity
    elif movement.type == "stock_out":
        product.quantity -= movement.quantity

    new_stock_movement = Stock_movements(
        product_id=movement.product_id,
        quantity=movement.quantity,
        type=movement.type,
        reason=movement.reason,
        user_id=1
    )

    db.add(new_stock_movement)      # stage it
    db.commit()           # save it
    db.refresh(new_stock_movement)  # get the updated object back (with id)

    return new_stock_movement
