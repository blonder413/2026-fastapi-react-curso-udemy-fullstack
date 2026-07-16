from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse

from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/plates-category", tags=["Plates category"])
