from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from database import get_session
from sqlmodel import Session

from interfaces.interfaces import GenericInterface
from models.models import PlatesCategory
from typing import Annotated

router = APIRouter(prefix="/plates-category", tags=["Plates category"])


@router.get("/", response_model=GenericInterface)
async def index(session: Annotated[Session, Depends(get_session)]):
    try:
        data = session.query(PlatesCategory).order_by(PlatesCategory.id.desc()).all()

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": {
                    "status_code": status.HTTP_200_OK,
                    "message": "Records Found",
                },
                "response": jsonable_encoder(data),
            },
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": {
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": str(e),
                },
                "response": {},
            },
        )


@router.get("/{id}", response_model=GenericInterface)
async def show(id: int, session: Annotated[Session, Depends(get_session)]):
    data = session.get(PlatesCategory, id)
    if not data:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "status": {
                    "status_code": status.HTTP_404_NOT_FOUND,
                    "message": "Not Found",
                },
                "response": {},
            },
        )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
            "response": data.model_dump(mode="json"),
        },
    )
