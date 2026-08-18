import bcrypt
from datetime import datetime


import os
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

load_dotenv()


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
