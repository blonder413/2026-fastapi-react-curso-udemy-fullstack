from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from database import get_session
from sqlalchemy import desc
from sqlmodel import Session, select
from typing import Annotated

from .dto.user_dto import UserDto
from interfaces.Response import ResponseInterface
from interfaces.User import UserResponse
from models.models import Estado, Profile, User
from utils.utils import generate_hash

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

@router.get("/{id}", response_model=ResponseInterface[UserResponse])
async def show(id:int, session: Annotated[Session, Depends(get_session)]):
    data=session.get(User,id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not Found")


    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Record Found"},
            "response": {
                **data.model_dump(mode="json", exclude=["password"]),
                "profile":data.profile.name if data.profile else ""
            },
        },
    )


@router.post("/", response_model=ResponseInterface[UserResponse])
async def create(dto:UserDto, session: Annotated[Session, Depends(get_session)]):
    profile=session.get(Profile, dto.profile_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile Not Found")
    
    exists=session.exec(
        select(User).where(User.email==dto.email)
    ).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El correo ya existe"
        )

    data=User(**dto.model_dump())
    data.password=generate_hash(dto.password)
    data.state_id=1
    data.token="abc123456"
    session.add(data)

    try:
        session.commit()
        session.refresh(data)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Error: {e}"
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Created"},
            "response": {
                **data.model_dump(mode="json", exclude=["password"]),
                "profile":data.profile.name if data.profile else "",
                "state":data.state.nombre if data.state else ""
            },
        },
    )


@router.put("/{id}", response_model=ResponseInterface[UserResponse])
async def update(id:int,dto:UserDto, session: Annotated[Session, Depends(get_session)]):
    profile=session.get(Profile, dto.profile_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Profile Not Found")
    

    state=session.get(Estado, dto.estado_id)
    if not state:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="State Not Found")
    
    data=session.get(User,id)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not Found")
    
    data.state_id=dto.estado_id
    data.profile_id=dto.profile_id
    data.name=dto.name
    data.email=dto.email

    if dto.update_password==1:
        data.password=generate_hash(dto.password)

    try:
        session.commit()
        session.refresh(data)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.http_400_BAD_REQUEST,
            detail=f"Error: {e}"
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Updated"},
            "response": {
                **data.model_dump(mode="json", exclude=["password"]),
                "profile":data.profile.name if data.profile else "",
                "state":data.state.nombre if data.state else ""
            },
        },
    )