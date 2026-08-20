import os
import smtplib
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

import bcrypt
from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import JWTError, jwt

load_dotenv()

algorithm = os.getenv("ALGORITHM")
secret_key = os.getenv("SECRET_KEY")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=algorithm)


def decode_access_token(token: str):
    try:
        return jwt.decode(token, secret_key, algorithms=algorithm)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Bearer"},
        )


def date_format(date: datetime) -> str:
    return date.strftime("%d/%m/%Y")


def generate_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def sendMail(html, subject, destinatary):
    user = os.getenv("SMTP_USER")

    msg = MIMEMultipart("alternave")
    msg["Subject"] = subject
    msg["From"] = user
    msg["To"] = destinatary
    msg.attach(MIMEText(html, "html"))

    server = smtplib.SMTP(os.getenv("SMTP_SERVER"), os.getenv("SMTP_PORT"))
    server.login(user, os.getenv("SMTP_PASSWORD"))
    server.sendmail(user, destinatary, msg.as_string())
    server.quit()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-"), hashed_password.encode("utf-8")
    )
