import asyncio
import os
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
                    if os.getenv("ENVIRONMENT")=="local":
                        sqs_client=boto3.client(
                            "sqs",
                            region_name=os.getenv("AWS_REGION"),
                            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                            endpoint_url=os.getenv("AWS_SECRET_ACCESS_URL"),
                        )
                    else:
                        sqs_client=boto3.client(
                            "sqs",
                            region_name=os.getenv("AWS_REGION"),
                            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                        )
                    queue_url=os.getenv("SQS_SEND_EMAIL")
                    response=await asyncio.to_thread(
                        sqs_client.receive_message,
                        QueueUrl=queue_url,
                        MaxNumberOfMessages=5,
                        WaitTimeSeconds=2,
                        MessageAttributeNames=["All"]
                    )
                    messages=response.get("Messages",[])
                    if not messages:
                        await asyncio.sleep(5)
                        continue
                    
                    for message in messages:
                        body_message=message["Body"]
                        attributes=message.get("MessageAttributes", {})
                        receipt_handle=message["ReceiptHandle"]
                        print(f"Procesando mensaje con token: {attributes.get('Token', {}).get("StringValue", "")}")
                        print("Attributes", attributes)
                        print("body", body_message)

                except ClientError as e:
                    print(f"Error SQS: {e}")
                    await asyncio.sleep(10)
                except Exception as e:
                    print(f"Error inesperado: {e}")

        create_task= asyncio.create_task(background_task())


    return worker_read_sqs