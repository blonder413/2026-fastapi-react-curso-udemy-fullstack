from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from database import get_session
from sqlmodel import Session
from models.models import Estado
from sqlalchemy import desc
from interfaces.interfaces import GenericInterface
from .dto.state_dto import StateDto

router = APIRouter(prefix="/state", tags=["State"])


@router.get("/", response_model=list[Estado])
async def index(session: Session = Depends(get_session)):
    data = session.query(Estado).order_by(desc(Estado.id)).all()
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK},
            "response": [value.model_dump() for value in data],
        },
    )


@router.get("/{id}")
async def show(id: int, session: Session = Depends(get_session)):
    data = session.get(Estado, id)

    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK},
            "response": data.model_dump(),
        },
    )


@router.post("/", response_model=GenericInterface)
async def create(dto: StateDto, session: Session = Depends(get_session)):
    dto.nombre = dto.nombre.lower()

    exists = session.query(Estado).filter(Estado.nombre == dto.nombre).first()
    if exists:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "El registro ya existe",
                },
                "response": {},
            },
        )

    try:
        data = Estado(**dto.model_dump())
        session.add(data)
        session.commit()
        session.refresh(data)
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

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": {"status_code": status.HTTP_201_CREATED, "message": "created"},
            "response": dto.model_dump(),
        },
    )


@router.put("/{id}", response_model=GenericInterface)
async def update(id: int, dto: StateDto, session: Session = Depends(get_session)):
    data = session.get(Estado, id)
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
    data = session.get(Estado, id)
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
