from fastapi import APIRouter, status
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/ejemplo", tags=["Ejemplo"])


@router.get("/")
async def index():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "Hello World"}
    )


@router.post("/")
async def create():
    return JSONResponse(
        status_code=status.HTTP_201_CREATED, content={"status": "ok", "message": "POST"}
    )


@router.put("/")
async def update():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"status": "ok", "message": "PUT"}
    )


@router.delete("/")
async def destroy():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"status": "ok", "message": "DELETE"}
    )
