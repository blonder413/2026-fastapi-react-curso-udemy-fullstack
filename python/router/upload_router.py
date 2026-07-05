from fastapi import APIRouter, status, Form, UploadFile
from fastapi.responses import JSONResponse
from typing import Annotated
import os
import uuid

router = APIRouter(prefix="/upload", tags=["Upload"])


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
