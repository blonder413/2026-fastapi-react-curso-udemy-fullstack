from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

from database import get_session
from dotenv import load_dotenv
import os
from slugify import slugify
from sqlalchemy import desc
from sqlmodel import Session, select
from typing import Annotated

from interfaces.interfaces import GenericInterface
from interfaces.Business import BusinessInterface
from models.models import Business, Category, User
from utils.utils import date_format
from .dto.business_dto import BusinessDto

load_dotenv()

router = APIRouter(prefix="/business", tags=["Business"])


@router.post("/", response_model=GenericInterface)
async def create(dto: BusinessDto, session: Annotated[Session, Depends(get_session)]):
    try:
        exists = session.query(Business).filter(Business.name == dto.name).first()
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

        category = session.get(Category, dto.category_id)
        if not category:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "status": {
                        "status_code": status.HTTP_400_BAD_REQUEST,
                        "message": "Category Not Found",
                    },
                    "response": {},
                },
            )

        user = session.exec(
            select(User).where(User.id == dto.user_id, User.state_id == 1)
        ).first()
        if not user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "status": {
                        "status_code": status.HTTP_400_BAD_REQUEST,
                        "message": "User Not Found",
                    },
                    "response": {},
                },
            )

        business = Business(
            state_id=1,
            category_id=dto.category_id,
            user_id=dto.user_id,
            name=dto.name,
            email=dto.email,
            phone_number=dto.phone_number,
            address=dto.address,
            logo=os.getenv("S3_LOGO_BUSINESS"),
            location=dto.location,
            description=dto.description,
            slug=slugify(dto.name),
        )

        session.add(business)
        session.commit()
        session.refresh(business)

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "status": {
                    "status_code": status.HTTP_201_CREATED,
                    "message": "Created",
                },
                "response": business.model_dump(mode="json"),
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


@router.get("/")
async def index(session: Annotated[Session, Depends(get_session)]):
    data = session.query(Business).order_by(desc(Business.id)).all()
    response = [
        BusinessInterface(
            id=business.id,
            state_id=business.state_id if business.state else None,
            state=business.state.nombre,
            category_id=business.category_id if business.category else None,
            category=business.category.nombre,
            user_id=business.user_id,
            user=business.user.name if business.user else None,
            name=business.name,
            slug=business.slug,
            email=business.email,
            phone_number=business.phone_number,
            address=business.address,
            logo=business.logo,
            location=business.location,
            description=business.description,
            date=date_format(business.date),
        ).model_dump(mode="json")
        for business in data
    ]
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
            "response": response,
        },
    )
