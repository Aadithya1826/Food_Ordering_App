from jose import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi import HTTPException

SECRET_KEY = "secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    password = password.strip()

    if len(password) > 72:
        raise HTTPException(status_code=400, detail="Password too long")

    return pwd_context.hash(password)


def verify_password(plain, hashed):
    try:
        plain = plain.strip()

        if len(plain) > 72:
            return False

        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


def create_token(user):
    data = {
        "user_id": str(user.id),
        "role": user.role,
        "restaurant_id": user.restaurant_id
    }

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})

    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)