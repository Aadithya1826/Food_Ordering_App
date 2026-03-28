from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models.user import User
from ..utils.auth import verify_password, create_token
from ..schemas import LoginRequest, LoginResponse, UserResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/api/v1/auth/login")
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_token(user)

    # Set HTTPOnly cookie for automatic authentication
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=1800,  # 30 minutes
        expires=1800,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "restaurant_id": user.restaurant_id
        }
    }


@router.post("/api/v1/auth/logout")
def logout(response: Response):
    """
    Logout endpoint - clears the authentication cookie
    """
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}