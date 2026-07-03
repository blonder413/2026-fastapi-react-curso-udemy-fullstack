from fastapi import APIRouter, status
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/ejemplo", tags=["Ejemplo"])


@router.get("/")
async def index():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "Hello World"}
    )
