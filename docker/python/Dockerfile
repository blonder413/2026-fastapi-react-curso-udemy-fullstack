FROM python:3.12-slim

# 🔹 todo en un solo RUN
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m appuser

WORKDIR /usr/src/app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

USER appuser

CMD ["tail", "-f", "/dev/null"]