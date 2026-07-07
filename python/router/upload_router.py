from fastapi import APIRouter, status, Form, Query, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from typing import Annotated
import os
import uuid
import boto3

from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/upload", tags=["Upload"])


s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    endpoint_url=os.getenv("AWS_SECRET_ACCESS_URL"),
)
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
AWS_BUCKET_URL = os.getenv("AWS_BUCKET_URL")


@router.post("/")
async def index(id: Annotated[int, Form()]):
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"status": status.HTTP_201_CREATED, "message": f"form-data: {id}"},
    )


@router.post("/file")
async def file(file: UploadFile):

    if file.content_type == "image/jpeg":
        extension = "jpg"
    elif file.content_type == "image/png":
        extension = "png"
    else:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"status": status.HTTP_400_BAD_REQUEST, "response": {}},
        )

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": status.HTTP_201_CREATED,
            "response": {
                "content-type": file.content_type,
                "extension": extension,
                "filename": f"{file.filename}",
                "size": file.size,
            },
        },
    )


@router.post("/local")
async def local(file: UploadFile):
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

    name = f"{uuid.uuid4()}.{extension}"
    file_location = os.path.join("uploads", name)
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": status.HTTP_201_CREATED,
            "response": {
                "content-type": file.content_type,
                "extension": extension,
                "filename": file.filename,
                "name": name,
                "size": file.size,
            },
        },
    )


@router.get("/get-file")
async def get_file(id: str = Query(..., description="Filename")):
    if not os.path.exists(f"uploads/{id}"):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "status": status.HTTP_404_NOT_FOUND,
                "response": {"message": "File Not Found"},
            },
        )
    return FileResponse(f"uploads/{id}")


@router.post("/s3")
async def s3(file: UploadFile):
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

    name = f"{uuid.uuid4()}.{extension}"
    try:
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET_NAME,
            f"files/{name}",
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

    file_url = f"{AWS_BUCKET_URL}/{S3_BUCKET_NAME}/files/{name}"

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": {"status_code": status.HTTP_201_CREATED, "message": "uploaded"},
            "response": {
                "content_type": file.content_type,
                "extension": extension,
                "filename": file.filename,
                "name": name,
                "size": file.size,
                "url": file_url,
            },
        },
    )


@router.delete("/s3")
async def remove(filename: str = Query(..., description="filename")):
    try:
        s3_client.head_object(Bucket=S3_BUCKET_NAME, Key=f"files/{filename}")
    except s3_client.exceptions.ClientError as e:
        if e.response["Error"]["Code"] == "404":
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "status": {
                        "status_code": status.HTTP_404_NOT_FOUND,
                        "message": f"{e.response['Error']['Message']}",
                    }
                },
            )
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Ocurrió un error inesperado",
                }
            },
        )

    try:
        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=f"files/{filename}")
    except s3_client.exceptions.ClientError as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "status": {
                    "status_code": status.HTTP_404_NOT_FOUND,
                    "message": f"{e.response['Error']['Message']}",
                }
            },
        )
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "status": {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Ocurrió un error inesperado al borrar el archivo",
                }
            },
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK},
            "response": {"message": f"File {filename} deleted"},
        },
    )
