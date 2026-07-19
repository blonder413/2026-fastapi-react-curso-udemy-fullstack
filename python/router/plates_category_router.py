from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from database import get_session
from slugify import slugify
from sqlmodel import Session

from interfaces.interfaces import GenericInterface
from models.models import PlatesCategory
from typing import Annotated

from .dto.plates_category_dto import PlatesCategoryDto

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


@router.post("/", response_model=GenericInterface)
async def create(
    dto: PlatesCategoryDto, session: Annotated[Session, Depends(get_session)]
):
    exists = session.query(PlatesCategory).filter_by(name=dto.name).first()
    if exists:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Not Found",
                },
                "response": {},
            },
        )

    try:
        data = PlatesCategory(name=dto.name, slug=slugify(dto.name))
        session.add(data)
        session.commit()

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "status": {
                    "status_code": status.HTTP_201_CREATED,
                    "message": "Created",
                },
                "response": data.model_dump(mode="json"),
            },
        )
    except Exception as e:
        session.rollback()
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": str(e),
                },
                "response": {},
            },
        )


@router.put("/{id}", response_model=GenericInterface)
async def update(
    id: int, dto: PlatesCategory, session: Annotated[Session, Depends(get_session)]
):
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

    try:
        data.name = dto.name
        data.slug = slugify(dto.name)
        session.commit()
        session.refresh(data)
    except Exception as e:
        session.rollback()
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": str(e),
                },
                "response": {},
            },
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Updated"},
            "response": data.model_dump(mode="json"),
        },
    )


@router.delete("/{id}", response_model=GenericInterface)
async def destroy(id: int, session: Annotated[Session, Depends(get_session)]):
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
    try:
        session.delete(data)
        session.commit()
    except Exception as e:
        session.rollback()
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": str(e),
                },
                "response": {},
            },
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Deleted"},
            "response": data.model_dump(mode="json"),
        },
    )
