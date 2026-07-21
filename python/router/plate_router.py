from fastapi import APIRouter

import boto3
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/plate", tags=["Plate"])


s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    endpoint_url=(
        os.getenv("AWS_SECRET_ACCESS_URL")
        if os.getenv("ENVIRONMENT") == "local"
        else None
    ),
)
