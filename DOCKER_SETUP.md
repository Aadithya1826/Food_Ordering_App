# Docker Setup Guide

## Running Frontend and Backend with Docker

This guide explains how to run the complete DATA UDIPI application using Docker and Docker Compose.

---

## Quick Start with Docker

### Prerequisites
- Docker installed
- Docker Compose installed

### 1. Build and Run with Docker Compose

```bash
# From the project root
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 2. Stop Services

```bash
docker-compose down
```

---

## Individual Docker Commands

### Build Frontend Image
```bash
cd frontend
docker build -t data-udipi-frontend .
```

### Run Frontend Container
```bash
docker run -p 3000:3000 data-udipi-frontend
```

### Build Backend Image
```bash
cd backend
docker build -t data-udipi-backend .
```

### Run Backend Container
```bash
docker run -p 8000:8000 data-udipi-backend
```

---

## Dockerfile for Frontend

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

---

## Dockerfile for Backend

Update `Dockerfile` in project root:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Updated Docker Compose

Update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: data-udipi-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000
    depends_on:
      - backend
    networks:
      - data-udipi-network

  # Backend Service
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: data-udipi-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./test.db
    volumes:
      - ./backend:/app/backend
    networks:
      - data-udipi-network
    command: uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

  # Database (Optional - if using PostgreSQL)
  # postgres:
  #   image: postgres:15-alpine
  #   container_name: data-udipi-db
  #   environment:
  #     POSTGRES_USER: dataudipi
  #     POSTGRES_PASSWORD: password
  #     POSTGRES_DB: data_udipi
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   networks:
  #     - data-udipi-network

networks:
  data-udipi-network:
    driver: bridge

volumes:
  postgres_data:
```

---

## Environment Configuration for Docker

### Frontend (.env in frontend directory)
```
VITE_API_URL=http://backend:8000
```

### Backend (.env in root directory)
```
DATABASE_URL=sqlite:///./test.db
JWT_SECRET=your-secret-key-here
DEBUG=True
```

---

## Production Docker Compose

For production deployment:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: data-udipi-frontend-prod
    ports:
      - "80:3000"
    environment:
      - VITE_API_URL=https://api.dataudipi.com
    networks:
      - data-udipi-network
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: data-udipi-backend-prod
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/data_udipi
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    networks:
      - data-udipi-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: data-udipi-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: data_udipi
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - data-udipi-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: data-udipi-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - data-udipi-network
    restart: unless-stopped

networks:
  data-udipi-network:
    driver: bridge

volumes:
  postgres_data:
```

---

## Docker Compose Commands

### Start Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f
```

### View Specific Service Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
docker-compose stop
```

### Remove Services
```bash
docker-compose down
```

### Remove All Data (including volumes)
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose up --build
```

---

## Accessing Services

### Frontend
```
http://localhost:3000
```

### Backend API
```
http://localhost:8000
```

### API Documentation (Swagger)
```
http://localhost:8000/docs
```

### ReDoc Documentation
```
http://localhost:8000/redoc
```

---

## Troubleshooting Docker

### Container Won't Start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild
docker-compose down
docker-compose up --build
```

### Port Already in Use
```bash
# List running containers
docker ps

# Stop specific container
docker stop container_name

# Or use different port in docker-compose.yml
# ports:
#   - "3001:3000"
```

### Database Connection Issues
```bash
# Verify container is running
docker-compose ps

# Check database logs
docker-compose logs postgres
```

### Frontend Can't Connect to Backend
```bash
# Check CORS configuration in backend
# Check VITE_API_URL in frontend .env
# Verify both services are in same network
docker network inspect data-udipi-network
```

---

## Deployment Checklist

### Before Production Deployment
- [ ] Update VITE_API_URL with production domain
- [ ] Set JWT_SECRET to strong random value
- [ ] Configure environment variables
- [ ] Enable SSL/HTTPS with nginx
- [ ] Set up PostgreSQL database
- [ ] Configure database backups
- [ ] Set up error logging
- [ ] Enable rate limiting
- [ ] Configure CDN
- [ ] Set resource limits for containers

### Docker Compose for Production
```yaml
version: '3.8'

services:
  backend:
    # ... service definition
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## Health Checks

Add health checks to docker-compose.yml:

```yaml
services:
  backend:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/docs"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    # ... other config
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## Scaling with Docker Compose

### Run Multiple Backend Instances with Load Balancing

```yaml
version: '3.8'

services:
  backend:
    build: .
    deploy:
      replicas: 3
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/data_udipi
    depends_on:
      - postgres

  nginx:
    image: nginx:alpine
    ports:
      - "8000:8000"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
```

---

## Monitoring with Docker

### View Resource Usage
```bash
docker stats
```

### View Container Details
```bash
docker inspect container_name
```

### View System Information
```bash
docker system df
```

### Clean Up Unused Resources
```bash
docker system prune
```

---

## Continuous Integration

Example GitHub Actions workflow for Docker:

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push backend
        run: |
          docker build -t myregistry/data-udipi-backend:latest .
          docker push myregistry/data-udipi-backend:latest
      
      - name: Build and push frontend
        run: |
          docker build -t myregistry/data-udipi-frontend:latest ./frontend
          docker push myregistry/data-udipi-frontend:latest
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Node.js](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Best Practices for Python](https://docs.docker.com/language/python/)

---

## Support

For Docker-related issues, refer to:
- Docker official documentation
- Docker Compose documentation
- Individual service documentation
