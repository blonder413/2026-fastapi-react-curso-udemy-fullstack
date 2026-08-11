# 2026-fastapi-react-curso-udemy-fullstack

Aprendiendo fastapi y react con un curso de udemy

# Levantar proyecto

```bash
docker exec -it curso-fastapi-python uvicorn main:app --host 0.0.0.0 --port 8050 --reload
```

# Contenedor localstack

```bash
docker exec -it curso-fastapi-localstack bash
```

## Lists S3 buckets

```bash
# inside container
awslocal s3 ls

# or outside container
docker exec -it curso-fastapi-localstack awslocal s3 ls
```

## Create bucket on localstack

```bash
# inside container
awslocal s3 mb s3://curso-udemy

# or outside container
docker exec -it curso-fastapi-localstack awslocal s3 mb s3://curso-udemy
```

# Lists elements in S3 bucket

```bash
docker exec -it curso-fastapi-localstack awslocal s3 ls s3://curso-udemy --recursive
```

# Create SQS on localstack

```bash
docker exec -it curso-fastapi-localstack awslocal sqs create-queue --queue-name send-email
```

# Lists SQS on localstack

```bash
docker exec -it curso-fastapi-localstack awslocal sqs list-queues
```

# Alembic

```bash
docker exec -it curso-fastapi-python alembic init alembi
```

# Migration

## Create

```bash
docker exec -it curso-fastapi-python alembic revision --autogenerate -m "create state table"
```

## Execute

```bash
docker exec -it curso-fastapi-python alembic upgrade head
```

# PyRight Configuration

Seleccionar el intérprete en VSCodium

```
Ctrl+Shift+P → Python: Select Interpreter
```

y seleccionar:

```
proyecto/.venv/bin/python
```

o en Windows

```
proyecto\.venv\Scripts\python.exe
```
