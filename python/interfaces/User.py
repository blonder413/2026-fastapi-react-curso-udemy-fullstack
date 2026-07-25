from pydantic import BaseModel

class UserResponse(BaseModel):
    id:int
    state_int:int
    state:str
    profile_id:int
    profile:str
    name:str
    email: str
    date:str

    class Config:
        from_attributes=True
