from pydantic import BaseModel


class PlateResponse(BaseModel):
    id: int
    name: str
    ingredients: str
    price: int
    photo: str
    plate_category: str

    class Config:
        from_attributes = True
