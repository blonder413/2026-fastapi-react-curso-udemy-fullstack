import os
from typing import Annotated

from database import get_session
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from interfaces.User import UserResponse
from jose import JWTError, jwt
from models.models import User
from sqlmodel import Session

from utils.utils import date_format

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


credentials_exception: HTTPException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Unauthorized",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)],
):
    try:
        payload = jwt.decode(
            token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")]
        )
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception

    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        state_id=user.state_id,
        state=user.state.nombre,
        profile_id=user.profile_id,
        profile=user.profile.name,
        date=date_format(user.date),
    )
