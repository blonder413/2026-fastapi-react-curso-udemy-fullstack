from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/state", tags=["State"])
