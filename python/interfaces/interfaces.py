from pydantic import BaseModel


class GenericInterface(BaseModel):
    state: str
    message: str
