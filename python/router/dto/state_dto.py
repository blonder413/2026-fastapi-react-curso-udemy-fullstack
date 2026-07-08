from pydantic import BaseModel, model_validator


class StateDto(BaseModel):
    name: str

    @model_validator(mode="after")
    def validate_name(self):
        if not self.name or len(self.name.strip()) < 3:
            raise ValueError("Min length: 3 characters")
        return self
