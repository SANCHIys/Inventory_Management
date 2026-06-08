from pydantic import BaseModel, EmailStr
from datetime import datetime;
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str

class CategoryResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int
    low_stock_threshold: int
    category_id: int

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    quantity: int
    sku: str
    low_stock_threshold: int
    category_id: int
    class Config:
        from_attributes = True

class StockMovementCreate(BaseModel):
    product_id: int
    quantity:int 
    type: str
    reason:str 

class StockMovementResponse(BaseModel):
    id: int
    product_id: int
    user_id:int 
    quantity:int 
    type: str
    reason:str 
    created_at: datetime
    class Config:
        from_attributes = True


