from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated

from database import get_session
from sqlmodel import Session, select

from .dto.login_dto import LoginDto
from interfaces.interfaces import GenericInterface
from interfaces.LoginResponse import LoginResponse
from models.models import User
from utils.utils import verify_password

router = APIRouter(prefix="/auth/login", tags=["Login"])


@router.post("/", response_model=LoginResponse)
async def login(dto: LoginDto, session: Annotated[Session, Depends(get_session)]):
    data = session.exec(
        select(User).where(User.email == dto.email, User.state_id == 1)
    ).first()
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not Found")

    if not verify_password(dto.password, data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password"
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "estado": "ok",
            "mensaje": "Inicio de sesión exitoso",
            "data": {
                "id": data.id,
                "name": data.name,
                "profile": data.profile_id,
                "token": "123456",
            },
        },
    )
