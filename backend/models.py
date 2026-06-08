from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base
from datetime import datetime

class Users(Base):
    __tablename__ = "users"
    id= Column(Integer, primary_key=True, index=True)
    name= Column(String)
    email= Column(String, unique=True, index=True)
    hashed_password= Column(String)

class Categories(Base):
    __tablename__ = "categories"
    id= Column(Integer, primary_key=True, index=True)
    name= Column(String)

class Products(Base):
    __tablename__ = "products"
    id= Column(Integer, primary_key=True, index=True)
    name= Column(String)
    sku= Column(String, unique=True, index=True)
    price= Column(Float)
    quantity= Column(Integer)
    low_stock_threshold= Column(Integer)
    category_id= Column(Integer, ForeignKey("categories.id"))
    created_at= Column(DateTime, default=datetime.utcnow)

class Stock_movements(Base):
    __tablename__ = "stock_movements"
    id= Column(Integer, primary_key=True, index=True)
    product_id= Column(Integer, ForeignKey("products.id"))
    user_id= Column(Integer, ForeignKey("users.id"))
    quantity= Column(Integer)
    type= Column(String)
    reason= Column(String)
    created_at= Column(DateTime, default=datetime.utcnow)