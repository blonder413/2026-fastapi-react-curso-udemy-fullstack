import bcrypt
from datetime import datetime


def date_format(date: datetime) -> str:
    return date.strftime("%d/%m/%Y")


def generate_hash(password:str)->str:
    salt=bcrypt.gensalt()
    hashed=bcrypt.hashpw(password.encode("utf-8"),salt)
    return hashed.decode("utf-8")