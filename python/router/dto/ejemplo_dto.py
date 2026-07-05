from pydantic import BaseModel, model_validator, StrictInt
from typing import Any


class EjemploDto(BaseModel):
    name: str
    description: str
    alive: bool
    age: StrictInt

    @model_validator(mode="after")
    def validate_name(self):
        if not self.name or len(self.name.strip()) < 3:
            raise ValueError("Min length: 3 characters")
        return self

    @model_validator(mode="after")
    def validate_age(self):
        if self.age <= 0:
            raise ValueError("Age must be greater than 0")
        return self
