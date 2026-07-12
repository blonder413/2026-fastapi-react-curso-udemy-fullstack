from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

from database import get_session
from sqlalchemy import desc
from sqlmodel import Session
from slugify import slugify

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


@router.post("/", response_model=GenericInterface)
async def create(dto: CategoryDto, session: Session = Depends(get_session)):
    try:
        exists = session.query(Category).filter(Category.nombre == dto.nombre).first()
        if exists:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content={
                    "status": {
                        "status_code": status.HTTP_409_CONFLICT,
                        "message": "Record already exists",
                    },
                    "response": {},
                },
            )

        category = Category(nombre=dto.nombre, slug=slugify(dto.nombre))

        session.add(category)
        session.commit()
        session.refresh(category)

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "status": {
                    "status_code": status.HTTP_201_CREATED,
                    "message": "Created",
                },
                "response": category.model_dump(),
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
async def update(id: int, dto: CategoryDto, session: Session = Depends(get_session)):
    data = session.get(Category, id)
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
        data.nombre = dto.nombre
        data.slug = slugify(dto.nombre)

        session.commit()
        session.refresh(data)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": {"status_code": status.HTTP_200_OK, "message": "Updated"},
                "response": data.model_dump(),
            },
        )
    except Exception as e:
        session.rollback()
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": f"Error: {e}",
                },
                "response": {},
            },
        )


@router.delete("/{id}", response_model=GenericInterface)
async def destroy(id: int, session: Session = Depends(get_session)):
    data = session.get(Category, id)
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
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": {"status_code": status.HTTP_200_OK, "messae": "Deleted"},
                "response": {},
            },
        )
    except Exception as e:
        session.rollback()
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": f"Error: {e}",
                },
                "response": {},
            },
        )
