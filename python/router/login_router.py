from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated

router=APIRouter(prefix="/auth/login", tags=["Login"])