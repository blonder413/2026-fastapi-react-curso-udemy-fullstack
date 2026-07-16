from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class Estado(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    users: list["User"] = Relationship(back_populates="state")
    business: list["Business"] = Relationship(back_populates="state")


class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    slug: str
    business: list["Business"] = Relationship(back_populates="category")


class Profile(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    users: list["User"] = Relationship(back_populates="profile")


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    state_id: int | None = Field(default=None, foreign_key="estado.id")
    state: Optional[Estado] = Relationship(back_populates="users")
    profile_id: int | None = Field(default=None, foreign_key="profile.id")
    profile: Optional[Profile] = Relationship(back_populates="users")
    business: list["Business"] = Relationship(back_populates="user")
    name: str
    email: str
    password: str
    token: str
    date: datetime = Field(default_factory=datetime.now)


class Business(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    state_id: int | None = Field(default=None, foreign_key="estado.id")
    state: Optional[Estado] = Relationship(back_populates="business")
    category_id: int | None = Field(default=None, foreign_key="category.id")
    category: Optional[Category] = Relationship(back_populates="business")
    user_id: int | None = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="business")
    name: str = Field(max_length=100)
    slug: str = Field(max_length=100)
    email: str = Field(max_length=150)
    phone_number: str = Field(max_length=20)
    address: str = Field(max_length=100)
    logo: Optional[str] = None
    location: str
    description: str
    date: datetime = Field(default_factory=datetime.now)


class PlatesCategory(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    slug: str
