from fastapi import FastAPI, status, Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError

from router.ejemplo_router import router as ejemplo_router
from router.upload_router import router as upload_router
from router.state_router import router as state_router
from router.category_router import router as category_router
from router.business_router import router as business_router
from router.business_logo_router import router as business_logo_router
from router.business_user_router import router as business_user_router
from router.plates_category_router import router as plates_category_router
from router.plate_router import router as plate_router

from dotenv import load_dotenv

load_dotenv()
import os

app = FastAPI()


@app.get("/")
def index():
    print(f"El valor de AWS_REGION es: {os.getenv('AWS_REGION')}")
    return {"message": "Hello World"}


@app.get("/json-response")
def json_response():
    return JSONResponse(
        status_code=status.HTTP_200_OK, content={"message": "It's work"}
    )


app.include_router(ejemplo_router)
app.include_router(upload_router)
app.include_router(state_router)
app.include_router(category_router)
app.include_router(business_router)
app.include_router(business_logo_router)
app.include_router(business_user_router)
app.include_router(plates_category_router)
app.include_router(plate_router)


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


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    custom_errors = []
    for error in exc.errors():
        field = error["loc"][-1]
        message = error["msg"]

        if message.startswith("Value error, "):
            try:
                _, custom_msg = eval(error["input"])
                message = custom_msg
            except:
                pass
        elif message == "Input sould be a valid integer":
            message = f"Field {field} must be an integer"
        elif message == "Field required":
            message = f"Field {field} is required"

        custom_errors.append({"field": field, "message": message})

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "status": "error",
            "errors": custom_errors,
            "message": "Validation errors",
        },
    )
