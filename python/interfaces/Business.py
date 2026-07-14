from pydantic import BaseModel


class BusinessInterface(BaseModel):
    id: int
    state_id: int
    state: str
    category_id: int
    category: str
    user_id: int
    user: str
    name: str
    slug: str
    email: str
    phone_number: str
    address: str
    logo: str
    location: str
    description: str
    date: str

    class Config:
        from_attributes = True
