from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

from router.ejemplo_router import router as ejemplo_router

app = FastAPI()


@app.get("/")
def index():
    return {"message": "Hello World"}


@app.get("/json-response")
def json_response():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "It's work"})

app.include_router(ejemplo_router)