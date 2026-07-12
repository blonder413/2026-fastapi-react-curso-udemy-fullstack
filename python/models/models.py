from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class Estado(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    users: list["User"] = Relationship(back_populates="state")


class Category(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    slug: str


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
    name: str
    email: str
    password: str
    token: str
    date: datetime = Field(default_factory=datetime.now)
