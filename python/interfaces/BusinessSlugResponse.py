from pydantic import BaseModel

from .Plate import PlateResponse


class BusinessSlugResponse(BaseModel):
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
    plates: list[PlateResponse]

    model_config = {"from_attributes": True}
