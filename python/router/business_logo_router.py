from fastapi import APIRouter, status, Depends, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse

import boto3
from database import get_session
from dotenv import load_dotenv
import os
from sqlmodel import Session
from typing import Annotated
import uuid

from models.models import Business

load_dotenv()

router = APIRouter(prefix="/business-logo", tags=["BusinessLogo"])

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_BUCKET_URL = os.getenv("AWS_BUCKET_URL")

if os.getenv("ENVIRONMENT") == "local":
    s3_client = boto3.client(
        "s3",
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        endpoint_url=os.getenv("AWS_SECRET_ACCESS_URL"),
    )
else:
    s3_client = boto3.client(
        "s3",
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    )


@router.post("/")
async def index(
    id: Annotated[int, Form()],
    file: UploadFile,
    session: Annotated[Session, Depends(get_session)],
):
    data = session.get(Business, id)
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
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": str(e),
                },
                "response": {},
            },
        )

    file_url = f"{AWS_BUCKET_URL}/{S3_BUCKET_NAME}/files/{file_name}"

    old_logo = data.logo
    try:
        data.logo = file_name
        session.commit()
        session.refresh(data)
    except Exception as e:
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

    if old_logo != os.getenv("S3_LOGO_BUSINESS"):
        try:
            s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=f"files/{old_logo}")
        except Exception as e:
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
            "status": {"status_code": status.HTTP_201_CREATED, "message": "Updated"},
            "response": {
                "data": data.model_dump(mode="json"),
                "file": {
                    "content_type": file.content_type,
                    "extension": extension,
                    "filename": file.filename,
                    "name": file_name,
                    "size": file.size,
                    "url": file_url,
                },
            },
        },
    )
