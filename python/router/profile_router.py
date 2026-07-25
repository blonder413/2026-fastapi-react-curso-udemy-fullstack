from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from database import get_session
from sqlmodel import Session
from typing import Annotated

from interfaces.Response import ResponseInterface
from models.models import Profile
from .dto.profile_dto import ProfileDto

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


@router.post("", response_model=ResponseInterface[Profile])
async def create(dto: ProfileDto, session: Annotated[Session, Depends(get_session)]):
    exists = session.query(Profile).filter(Profile.name == dto.name).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Record exists"
        )

    try:
        data = Profile(**dto.model_dump())
        session.add(data)
        session.commit()
        session.refresh(data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "status": {
                    "status_code": status.HTTP_201_CREATED,
                    "message": "Created",
                },
                "response": data.model_dump(),
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error: {str(e)}"
        )


@router.put("/{id}", response_model=ResponseInterface[Profile])
async def update(
    id: int, dto: ProfileDto, session: Annotated[Session, Depends(get_session)]
):
    data = session.get(Profile, id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")

    try:
        data.name = dto.name
        session.commit()
        session.refresh(data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error: {str(e)}"
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Uṕdated"},
            "response": data.model_dump(),
        },
    )
