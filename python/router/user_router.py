from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from database import get_session
from sqlalchemy import desc
from sqlmodel import Session
from typing import Annotated

from interfaces.Response import ResponseInterface
from interfaces.User import UserResponse
from models.models import User

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/", response_model=ResponseInterface[list[UserResponse]])
async def index(session: Annotated[Session, Depends(get_session)]):
    data=session.query(User).order_by(desc(User.id)).all()

    response=[
        UserResponse(
            id=user.id,
            state_id=user.state_id,
            state=user.state.nombre if user.state else "",
            profile_id=user.profile_id,
            profile=user.profile.name if user.profile.name else "",
            name=user.name,
            email=user.email,
            date= str(user.date)
        ).model_dump() for user in data
    ]

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status":{"status_code":status.HTTP_200_OK, "message":"Record Found"},
            "response":response
        }
    )