from pydantic import BaseModel


class LoginResponse(BaseModel):
    state: str
    message: str
    data: dict | None = None
