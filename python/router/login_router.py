from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Annotated

from .dto.login_dto import LoginDto
from interfaces.interfaces import GenericInterface
from interfaces.LoginResponse import LoginResponse
from utils.utils import verify_password

router = APIRouter(prefix="/auth/login", tags=["Login"])
