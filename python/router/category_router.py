from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/category", tags=["Category"])