import asyncio
import os
from re import sub
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError

from utils.utils import sendMail
from models.models import User
from database import engine
from sqlmodel import Session, select

load_dotenv()


def start_sqs_background_task(app):
    @app.on_event("startup")
    def worker_read_sqs():
        async def background_task():
            while True:
                try:
                    if os.getenv("ENVIRONMENT") == "local":
                        sqs_client = boto3.client(
                            "sqs",
                            region_name=os.getenv("AWS_REGION"),
                            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                            endpoint_url=os.getenv("AWS_SECRET_ACCESS_URL"),
                        )
                    else:
                        sqs_client = boto3.client(
                            "sqs",
                            region_name=os.getenv("AWS_REGION"),
                            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                        )
                    queue_url = os.getenv("SQS_SEND_EMAIL")
                    response = await asyncio.to_thread(
                        sqs_client.receive_message,
                        QueueUrl=queue_url,
                        MaxNumberOfMessages=5,
                        WaitTimeSeconds=2,
                        MessageAttributeNames=["All"],
                    )
                    messages = response.get("Messages", [])
                    if not messages:
                        await asyncio.sleep(5)
                        continue

                    for message in messages:
                        body_message = message["Body"]
                        attributes = message.get("MessageAttributes", {})
                        receipt_handle = message["ReceiptHandle"]

                        try:
                            token = attributes.get("Token", {}).get("StringValue", "")
                            name = attributes.get("Nombre", {}).get("StringValue", "User")

                            with Session(engine) as session:
                                user = session.exec(
                                    select(User).where(User.token == token, User.state_id == 1)
                                ).first()

                            if not user:
                                print("User not found with token:", token)

                                await asyncio.to_thread(
                                    sqs_client.delete_message,
                                    QueueUrl=queue_url,
                                    ReceiptHandle=receipt_handle
                                )
                                print("Delete message (user not found)")
                                continue
                            
                            html= f"""
                            <h2>Password Recovery</h2>
                            <p>{user.name}</p>
                            <p>Click en el siguiente enlace para restablecer la contraseña:</p>
                            <a href="{body_message}">{body_message}</a>
                            <p><small>Este enlace expira en 24 horas</small>
                            </p>
                            """
                            sendMail(html=html,subject="Restablecer contraseña", destinatary=user.email)
                            await asyncio.to_thread(
                                    sqs_client.delete_message,
                                    QueueUrl=queue_url,
                                    ReceiptHandle=receipt_handle
                                )
                            print("Delete message (email send)")
                        except Exception as e:
                            print("Error processing message:", e)

                except ClientError as e:
                    print(f"Error SQS: {e}")
                    await asyncio.sleep(10)
                except Exception as e:
                    print(f"Error inesperado: {e}")

        create_task = asyncio.create_task(background_task())

    return worker_read_sqs

