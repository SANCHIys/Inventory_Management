from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Categories
from schemas import CategoryCreate, CategoryResponse
from typing import List

router = APIRouter()

@router.post("/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    # 1. check if category name already exists
    existing_category = db.query(Categories).filter(Categories.name == category.name).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="Category already registered")
    # 2. create new category object
    new_category = Categories(name=category.name)
    
    # 3. save to db
    db.add(new_category)      # stage it
    db.commit()           # save it
    db.refresh(new_category)  # get the updated object back (with id)

    # 4. return
    return new_category

@router.get("/", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    # just return all categories
    return db.query(Categories).all()