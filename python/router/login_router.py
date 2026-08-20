import os
from typing import Annotated

from database import get_session
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from interfaces.interfaces import GenericInterface
from interfaces.LoginResponse import LoginResponse
from models.models import User
from sqlmodel import Session, select
from utils.utils import create_access_token, verify_password

from .dto.login_dto import LoginDto

router = APIRouter(prefix="/auth/login", tags=["Login"])

load_dotenv()


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

    token = create_access_token(
        data={"sub": str(data.id), "name": data.name, "issuer": os.getenv("ISSUER")}
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
                "token": token,
            },
        },
    )
