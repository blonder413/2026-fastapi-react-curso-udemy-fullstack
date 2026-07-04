from fastapi import FastAPI, status, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from router.ejemplo_router import router as ejemplo_router

app = FastAPI()


@app.get("/")
def index():
    return {"message": "Hello World"}


@app.get("/json-response")
def json_response():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "It's work"}
    )


@app.exception_handler(status.HTTP_404_NOT_FOUND)
async def not_found_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"status": status.HTTP_404_NOT_FOUND, "message": "Not Found"},
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
        return JSONResponse(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            content={
                "status": status.HTTP_405_METHOD_NOT_ALLOWED,
                "message": "Method not allowed",
            },
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": exc.status_code, "message": str(exc.detail)},
    )


app.include_router(ejemplo_router)
