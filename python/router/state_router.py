from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from database import get_session
from sqlmodel import Session
from models.models import Estado
from sqlalchemy import desc

router = APIRouter(prefix="/state", tags=["State"])


@router.get("/", response_model=list[Estado])
async def index(session: Session = Depends(get_session)):
    data = session.query(Estado).order_by(desc(Estado.id)).all()
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK},
            "response": [value.model_dump() for value in data],
        },
    )


@router.get("/{id}")
async def show(id: int, session: Session = Depends(get_session)):
    data = session.get(Estado, id)

    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {"status_code": status.HTTP_200_OK},
            "response": data.model_dump(),
        },
    )
