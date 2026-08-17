import os
import time
from typing import Annotated
import uuid

import boto3
from botocore.exceptions import ClientError
from database import get_session
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from interfaces.interfaces import GenericInterface
from models.models import User
from sqlmodel import Session, select
from utils.utils import generate_hash

from .dto.recovery_dto import RecoveryDto, RecoveryUpdateDto

router = APIRouter(prefix="/recovery", tags=["Recovery"])

load_dotenv()

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


@router.post("/", response_model=GenericInterface)
async def create(dto: RecoveryDto, session: Annotated[Session, Depends(get_session)]):
    user = session.exec(
        select(User).where(User.email == dto.email, User.state_id == 1)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    token = f"{uuid.uuid4()}{int(time.time())}{uuid.uuid4()}"
    url = f"{os.getenv('BASE_URL_FRONTEND')}/recovery/update/{token}"

    try:
        user.token = token
        session.commit()
        session.refresh(user)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error: {str(e)}"
        )

    try:
        if os.getenv("ENVIRONMENT") == "local":
            sqs_client.send_message(
                QueueUrl=os.getenv("SQS_SEND_EMAIL"),
                MessageBody=url,
                MessageAttributes={
                    "Nombre": {"DataType": "String", "StringValue": user.name},
                    "Token": {"DataType": "String", "StringValue": token},
                },
            )
        else:
            message_group_id = str(int(time.time()))
            sqs_client.send_message(
                QueueUrl=os.getenv("SQS_SEND_EMAIL"),
                MessageBody=url,
                MessageAttributes={
                    "Nombre": {"DataType": "String", "StringValue": user.name},
                    "Token": {"DataType": "String", "StringValue": token},
                },
                MessageGroupId=message_group_id,
                MessageDeduplicationId=str(uuid.uuid4()),
            )
    except ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_msg = e.response["Error"]["Message"]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error: {error_code}: {error_msg}",
        )

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {
                "status_code": status.HTTP_200_OK,
                "message": "Recovery token created",
            },
            "response": {},
        },
    )


@router.post("/update/{token}")
async def update(
    token: str,
    dto: RecoveryUpdateDto,
    session: Annotated[Session, Depends(get_session)],
):
    data = session.exec(
        select(User).where(User.token == token, User.state_id == 1)
    ).first()
    if not data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Missing token"
        )

    try:
        data.password = generate_hash(dto.password)
        data.token = ""
        session.commit()
        session.refresh(data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error: {str(e)}"
        )
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "status": {
                "status_code": status.HTTP_200_OK,
                "message": "Password updated",
            },
            "response": {},
        },
    )
