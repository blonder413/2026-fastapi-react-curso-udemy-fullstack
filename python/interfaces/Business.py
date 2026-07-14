from datetime import datetime
from pydantic import BaseModel, field_validator


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

    # Interceptamos las relaciones y la fecha antes de la validación de Pydantic
    @field_validator("state", "category", "user", "date", mode="before")
    @classmethod
    def transform_relations(cls, value, info):
        if value is None:
            return None

        # Extrae el nombre del objeto Estado
        if info.field_name == "state" and hasattr(value, "nombre"):
            return value.nombre

        # Extrae el nombre del objeto Category
        if info.field_name == "category" and hasattr(value, "nombre"):
            return value.nombre

        # Extrae el name del objeto User
        if info.field_name == "user" and hasattr(value, "name"):
            return value.name

        # Formatea el objeto datetime a un string limpio
        if info.field_name == "date" and isinstance(value, datetime):
            return value.strftime("%Y-%m-%d %H:%M:%S")

        return value
