# Dockerfile for FastAPI backend
FROM python:3.12-slim

# set working directory
WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# copy application code
COPY backend/app ./app

# expose uvicorn port
EXPOSE 8000

# default command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
