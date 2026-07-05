from fastapi import APIRouter, status, Form, UploadFile
from fastapi.responses import JSONResponse
from typing import Annotated

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/")
async def index(id: Annotated[int, Form()]):
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"status": status.HTTP_201_CREATED, "message": f"form-data: {id}"},
    )


@router.post("/file")
async def file(file: UploadFile):
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "status": status.HTTP_201_CREATED,
            "response": {
                "content-type": file.content_type,
                "filename": f"{file.filename}",
                "size": file.size,
            },
        },
    )
