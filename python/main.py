from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

app = FastAPI()


@app.get("/")
def index():
    return {"message": "Hello World"}


@app.get("/json-response")
def json_response():
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "It's work"})