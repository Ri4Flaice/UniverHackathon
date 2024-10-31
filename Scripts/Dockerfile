FROM python:3.11.4-slim-buster

RUN apt-get update && \
    apt-get install -y gcc libpq-dev && \
    apt clean && \
    rm -rf /var/cache/apt/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

WORKDIR /slava_api
COPY ../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


CMD ["uvicorn", "Scripts.main:app", "--host", "0.0.0.0", "--port", "8008"]