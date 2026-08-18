from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated

from .dto.login_dto import LoginDto

router=APIRouter(prefix="/auth/login", tags=["Login"])