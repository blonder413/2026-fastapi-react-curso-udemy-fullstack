from fastapi import APIRouter, Depends, Form, Query, status, UploadFile
from fastapi.responses import JSONResponse

import boto3
from database import get_session
from dotenv import load_dotenv
from interfaces.interfaces import GenericInterface
from interfaces.Plate import PlateResponse
from interfaces.Response import ResponseInterface
import os
from sqlmodel import select, Session
from typing import Annotated
import uuid

from models.models import Business, Plate, PlatesCategory

load_dotenv()

router = APIRouter(prefix="/plate", tags=["Plate"])

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_BUCKET_URL = os.getenv("AWS_BUCKET_URL")

s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    endpoint_url=(
        os.getenv("AWS_SECRET_ACCESS_URL")
        if os.getenv("ENVIRONMENT") == "local"
        else None
    ),
)


@router.post("/")
async def create(
    business_id: Annotated[int, Form()],
    plates_category_id: Annotated[int, Form()],
    name: Annotated[str, Form()],
    ingredients: Annotated[str, Form()],
    price: Annotated[int, Form()],
    file: UploadFile,
    session: Annotated[Session, Depends(get_session)],
):
    business = session.get(Business, business_id)
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

    plate_category = session.get(PlatesCategory, plates_category_id)
    if not plate_category:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "status": {
                    "status_code": status.HTTP_404_NOT_FOUND,
                    "message": "PlateCategory  Not Found",
                },
                "response": {},
            },
        )

    exists = session.exec(
        select(Plate).where(Plate.name == name, Plate.business_id == business_id)
    ).first()
    if exists:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Information exists",
                },
                "response": {},
            },
        )

    if file.content_type == "image/jpeg":
        extension = "jpg"
    elif file.content_type == "image/png":
        extension = "png"
    else:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Invalid file",
                },
                "response": {},
            },
        )

    file_name = f"{uuid.uuid4()}.{extension}"

    try:
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET_NAME,
            f"files/{file_name}",
            ExtraArgs={"ContentType": file.content_type},
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

    data = Plate(
        plates_category_id=plates_category_id,
        business_id=business_id,
        name=name,
        price=price,
        ingredients=ingredients,
        photo=file_name,
    )
    try:
        session.add(data)
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
        status_code=status.HTTP_201_CREATED,
        content={
            "status": {"status_code": status.HTTP_201_CREATED, "message": "Created"},
            "response": data.model_dump(mode="json"),
        },
    )


@router.get("/", response_model=ResponseInterface[list[PlateResponse]])
def index(
    business_id: Annotated[int, Query()],
    session: Annotated[Session, Depends(get_session)],
):
    business = session.get(Business, business_id)
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

    data = session.exec(
        select(Plate).order_by(Plate.id.desc()).where(Plate.business_id == business_id)
    ).all()

    response = [
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
            plate_category=(
                plate.plates_category.name if plate.plates_category else ""
            ),
        ).model_dump(mode="json")
        for plate in data
    ]

    return {
        "status": {"status_code": status.HTTP_200_OK, "message": "Records Found"},
        "response": response,
    }
