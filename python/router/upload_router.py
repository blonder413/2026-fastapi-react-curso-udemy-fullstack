from fastapi import APIRouter, status, Form
from fastapi.responses import JSONResponse
from typing import Annotated

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/")
async def upload(id: Annotated[int, Form()]):
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"status": status.HTTP_201_CREATED, "message": f"File uploaded: {id}"},
    )
