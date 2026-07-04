from fastapi import FastAPI, status, Request
from fastapi.responses import JSONResponse

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


app.include_router(ejemplo_router)
