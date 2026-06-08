from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
pwd_context = CryptContext(schemes=["bcrypt"])

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data):
    to_encode = data.copy()        # step 1 - copy
    expire = datetime.utcnow() + timedelta(minutes=30)  # step 2 - expiry
    to_encode.update({"exp": expire})  # step 3 - add expiry to copy
    # now encode and return it!
    token = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return token
    