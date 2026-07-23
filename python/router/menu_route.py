from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from database import get_session
import os
from sqlmodel import select, Session
from typing import Annotated

from interfaces.Plate import PlateResponse
from interfaces.Response import ResponseInterface
from models.models import Business, Plate

router = APIRouter(prefix="/menu", tags=["Menu"])

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_BUCKET_URL = os.getenv("AWS_BUCKET_URL")


@router.get("/{slug}", response_model=ResponseInterface[list[PlateResponse]])
async def show(slug: str, session: Annotated[Session, Depends(get_session)]):
    business = session.exec(
        select(Business).where(Business.slug == slug, Business.state_id == 1)
    ).first()
    if not business:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "status": {
                    "status_code": status.HTTP_404_NOT_FOUND,
                    "message": "Business Not Found",
                },
                "response": {},
            },
        )

    plates = session.exec(select(Plate).where(Plate.business_id == business.id)).all()
    plates_response = [
        PlateResponse(
            id=plate.id,
            name=plate.name,
            ingredients=plate.ingredients,
            price=plate.price,
            photo=(
                f"{AWS_BUCKET_URL}/{S3_BUCKET_NAME}/files/{plate.photo}"
                if os.getenv("ENVIRONMENT") == "local"
                else f"https://{S3_BUCKET_NAME}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/files/{plate.photo}"
            ),
            plate_category=plate.plates_category.name if plate.plates_category else "",
        ).model_dump()
        for plate in plates
    ]

    if os.getenv("ENVIRONMENT") == "local":
        logo = f"{AWS_BUCKET_URL}/{S3_BUCKET_NAME}/files/{business.logo}"
    else:
        logo = f"https://{S3_BUCKET_NAME}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/files/{business.logo}"

    response = {
        "id": business.id,
        "state_id": business.state_id,
        "state": business.state.nombre if business.state else "",
        "category_id": business.category_id,
        "category": business.category.nombre if business.category else "",
        "user_id": business.user_id,
        "user": business.user.name if business.user else "",
        "name": business.name,
        "slug": business.slug,
        "email": business.email,
        "phone_number": business.phone_number,
        "address": business.address,
        "logo": logo,
        "location": business.location,
        "description": business.description,
        "date": str(business.date),
        "plates": plates_response,
    }

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
            "response": response,
        },
    )
