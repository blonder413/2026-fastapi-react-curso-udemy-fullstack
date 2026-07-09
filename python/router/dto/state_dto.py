from pydantic import BaseModel, model_validator


class StateDto(BaseModel):
    nombre: str

    @model_validator(mode="after")
    def validate_nombre(self):
        if not self.nombre or len(self.nombre.strip()) < 3:
            raise ValueError("Min length: 3 characters")
        return self
