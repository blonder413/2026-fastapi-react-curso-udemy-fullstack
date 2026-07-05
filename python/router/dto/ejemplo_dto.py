from pydantic import BaseModel


class EjemploDto(BaseModel):
    name: str
    description: str
    alive: bool
