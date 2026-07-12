from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

from database import get_session
from sqlalchemy import desc
from sqlmodel import Session

from .dto.category_dto import CategoryDto
from interfaces.interfaces import GenericInterface
from models.models import Category

router = APIRouter(prefix="/category", tags=["Category"])


@router.get("/", response_model=list[Category])
async def index(session: Session = Depends(get_session)):
    data = session.query(Category).order_by(desc(Category.id)).all()
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
            "response": [value.model_dump() for value in data],
        },
    )


@router.get("/{id}", response_model=list[Category])
async def index(id: int, session: Session = Depends(get_session)):
    data = session.get(Category, id)
    if not data:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "status": {
                    "status_code": status.HTTP_404_NOT_FOUND,
                    "message": "Not found",
                },
                "response": {},
            },
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Record Found"},
            "response": data.model_dump(),
        },
    )
