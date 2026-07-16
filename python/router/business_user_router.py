from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

from database import get_session
from dotenv import load_dotenv
import os
from sqlalchemy.orm import joinedload
from sqlmodel import Session
from typing import Annotated

from interfaces.interfaces import GenericInterface
from interfaces.Business import BusinessInterface
from models.models import Business, User

load_dotenv()

router = APIRouter(prefix="/business-by-user", tags=["Business by user"])


@router.get("/{id}", response_model=GenericInterface)
async def show(id: int, session: Annotated[Session, Depends(get_session)]):

    user = session.get(User, id)
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

    # Each user have only one business
    data = (
        session.query(Business)
        .options(
            joinedload(Business.state),
            joinedload(Business.category),
            joinedload(Business.user),
        )
        .filter(Business.user_id == id)
        .first()
    )
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

    if os.getenv("ENVIRONMENT") == "local":
        data.logo = f"{os.getenv('AWS_BUCKET_URL')}/{os.getenv('S3_BUCKET_NAME')}/files/{data.logo}"
    else:
        data.logo = f"https://{os.getenv('S3_BUCKET_NAME')}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/files/{data.logo}"

    response = BusinessInterface.model_validate(data).model_dump(
        mode="json", exclude={"state_id", "category_id", "user_id"}
    )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK, "message": "Record Found"},
            "response": response,
        },
    )
