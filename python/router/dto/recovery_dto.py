from pydantic import BaseModel


class RecoveryDto(BaseModel):
    email: str


class RecoveryUpdateDto(BaseModel):
    password: str
