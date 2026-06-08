from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Users
from schemas import UserCreate, UserResponse, UserLogin
from auth_utils import hash_password, verify_password, create_access_token

router = APIRouter()

# REGISTER ENDPOINT
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. check if email exists
    existing_user = db.query(Users).filter(Users.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. hash the password
    hashed = hash_password(user.password)
    
    # 3. create new user object
    new_user = Users(name=user.name, email=user.email, hashed_password=hashed)
    
    # 4. save to db (3 lines)
    db.add(new_user)      # stage it
    db.commit()           # save it
    db.refresh(new_user)  # get the updated object back (with id)
    
    # 5. return
    return new_user

# LOGIN ENDPOINT  
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    #1. check if eamil exists
    not_existing_user = db.query(Users).filter(Users.email == user.email).first()
    if not not_existing_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    #2. password verification
    if not verify_password(user.password, not_existing_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    #3. JWT token
    token = create_access_token({"sub": not_existing_user.email})

    #4. Return
    return {"access_token": token, "token_type": "bearer"}