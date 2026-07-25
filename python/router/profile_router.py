from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from database import get_session
from sqlmodel import Session
from typing import Annotated

from interfaces.Response import ResponseInterface
from models.models import Profile

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/", response_model=ResponseInterface[list[Profile]])
async def index(session: Annotated[Session, Depends(get_session)]):
    data = session.query(Profile).order_by(Profile.id.desc()).all()
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
            "response": [record.model_dump() for record in data],
        },
    )


@router.get("/{id}", response_model=ResponseInterface[Profile])
async def show(id: int, session: Annotated[Session, Depends(get_session)]):
    data = session.get(Profile, id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
            "response": data.model_dump(),
        },
    )
