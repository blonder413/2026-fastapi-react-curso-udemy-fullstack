from fastapi import APIRouter, status
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/ejemplo", tags=["Ejemplo"])


@router.get("/")
async def index():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "Hello World"}
    )


@router.get("/{id}")
async def show(id: int):
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"status": "ok", "message": {"id": id}}
    )


@router.post("/")
async def create():
    return JSONResponse(
        status_code=status.HTTP_201_CREATED, content={"status": "ok", "message": "POST"}
    )


@router.put("/{id}")
async def update(id: int):
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"status": "ok", "message": f"PUT {id}"}
    )


@router.delete("/{id}")
async def destroy(id: int):
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"status": "ok", "message": f"DELETE {id}"},
    )
