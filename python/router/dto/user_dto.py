from pydantic import BaseModel, model_validator
from typing import Optional

class UserDto(BaseModel):
    estado_id:Optional[int]=None
    profile_id:int
    name:str
    email:str
    password:str
    update_password:Optional[int]=None

    @model_validator(mode="after")
    def validate_name(self):
        if not self.name or len(self.name.strip()) < 3:
            raise ValueError("Min length: 3 characters")
        return self
