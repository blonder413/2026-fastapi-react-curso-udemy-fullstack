from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

from database import get_session
from dotenv import load_dotenv
import os
from slugify import slugify
from sqlalchemy import desc
from sqlmodel import Session
from typing import Annotated

from interfaces.interfaces import GenericInterface
from models.models import Business, Category
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
