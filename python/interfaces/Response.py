from typing import Generic, TypeVar, List
from pydantic import BaseModel

# Creamos un tipo variable para que el campo response sea flexible
T = TypeVar("T")


class StatusSchema(BaseModel):
    status_code: int
    message: str

class ResponseInterface(BaseModel, Generic[T]):
    status: StatusSchema
    response: T
