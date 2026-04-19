# Docker Quick Start Guide

## Running the Complete Application

### Start All Services
```bash
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **PostgreSQL Database**: localhost:5432

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

## Services Configuration

### Frontend
- **Port**: 3000
- **Build**: Multi-stage build using Node.js 18-alpine
- **Production Server**: `serve` package
- **Build Process**: Vite build optimization

### Backend
- **Port**: 8000
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: PostgreSQL 15

### Database
- **Image**: PostgreSQL 15
- **Port**: 5432
- **Default User**: food_admin
- **Default Password**: foodadmin@123
- **Database**: food_ordering_db

## Individual Service Commands

### Build Frontend Only
```bash
docker build -t food-ordering-frontend:latest ./frontend
```

### Build Backend Only
```bash
docker build -t food-ordering-backend:latest .
```

### Run Frontend Container
```bash
docker run -p 3000:3000 food-ordering-frontend:latest
```

### Run Backend Container
```bash
docker run -p 8000:8000 food-ordering-backend:latest
```

## Viewing Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Follow logs
docker-compose logs -f
```

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is already in use:

```bash
# Change port mapping in docker-compose.yml
# For frontend: "3001:3000" instead of "3000:3000"
# For backend: "8001:8000" instead of "8000:8000"
```

### Database Connection Issues
Ensure the database is healthy:
```bash
docker-compose ps
```

Check database logs:
```bash
docker-compose logs db
```

### Frontend Can't Connect to Backend
- Verify backend container is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify API_URL environment variable is set correctly

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://backend:8000 in Docker)

### Backend
- `DATABASE_URL`: PostgreSQL connection string

## Development Mode

For development with hot-reload:

Update `docker-compose.yml` backend command:
```yaml
command: ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```
