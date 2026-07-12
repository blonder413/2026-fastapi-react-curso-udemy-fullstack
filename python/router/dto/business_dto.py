from pydantic import BaseModel, model_validator
from typing import Optional


class BusinessDto(BaseModel):
    state_id: Optional[int] = None
    category_id: int
    user_id: int
    name: str
    email: str
    phone_number: str
    address: str
    location: str

    @model_validator(mode="after")
    def validate_name(self):
        if not self.name or len(self.name.strip()) < 3:
            raise ValueError("Min length: 3 characters")
        return self
