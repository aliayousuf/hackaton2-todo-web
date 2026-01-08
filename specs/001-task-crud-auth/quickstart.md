# Development Quickstart Guide

**Feature**: Task CRUD Operations with Authentication (Phase II)
**Date**: 2026-01-04
**Branch**: 001-task-crud-auth

## Overview

This guide provides instructions for setting up and running the full-stack Todo application with authentication locally. The application consists of a Next.js frontend, FastAPI backend, and PostgreSQL database.

## Prerequisites

- Docker and Docker Compose (v2.0+)
- Node.js 18+ (for local development without Docker)
- Python 3.13+ (for local development without Docker)
- Git

## Quick Setup (Recommended)

### 1. Clone and Configure
```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Copy environment files
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp .env.example .env
```

### 2. Configure Environment Variables
Update the environment files with your specific configuration:

**frontend/.env.local**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Todo App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

**backend/.env**:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
UV_ENVIRONMENT=development
PORT=8000
HOST=0.0.0.0
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
BCRYPT_ROUNDS=12
LOG_LEVEL=INFO
```

### 3. Start with Docker Compose (Single Command)
```bash
# Start the entire stack
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# Database: localhost:5432 (for direct access if needed)
```

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│     Backend      │────│   PostgreSQL    │
│   Next.js       │    │    FastAPI       │    │                 │
│   Port 3000     │    │    Port 8000     │    │   Port 5432     │
│   App Router    │    │    SQLModel      │    │   Neon (prod)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Development Workflow

### Hot Reload
- **Frontend**: Changes to React components automatically reload (3s max reload time)
- **Backend**: Python changes trigger FastAPI auto-reload
- **Database**: Schema changes require migration updates

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# E2E tests
cd frontend
npx playwright test
```

### Database Migrations
```bash
# Run migrations
cd backend
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "Description of changes"

# Check current migration status
alembic current
```

## Database Access

### Direct PostgreSQL Access
```bash
# Connect to local database
psql postgresql://postgres:password@localhost:5432/todo_db

# Or use Docker
docker exec -it <postgres-container> psql -U postgres -d todo_db
```

### Production (Neon)
- Use Neon dashboard for database management
- Connection string in production environment variables
- Migrations applied through deployment pipeline

## Authentication Flow

1. User registers via `/api/auth/register` endpoint
2. Credentials validated and user stored with bcrypt-hashed password
3. User logs in via `/api/auth/login` endpoint
4. JWT token issued and stored in httpOnly cookie
5. Token validated on all protected endpoints
6. User data isolated by user_id on all database queries

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update entire task
- `PATCH /api/tasks/{id}` - Partial update (e.g., toggle completion)
- `DELETE /api/tasks/{id}` - Delete task

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check if ports are in use
netstat -an | grep -E '3000|8000|5432'

# Kill processes using the ports if needed
lsof -ti:3000 | xargs kill
lsof -ti:8000 | xargs kill
```

**Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart just the database
docker-compose restart postgres

# Check connection
docker-compose exec postgres pg_isready
```

**Migration Issues**
```bash
# Check current migration status
cd backend
alembic current

# If migration is stuck, mark as current without running
alembic stamp head
```

**Authentication Issues**
- Verify JWT_SECRET is the same in frontend and backend
- Check httpOnly cookies are enabled in browser
- Verify time synchronization between services

### Development Tips
- Use `docker-compose logs -f` to monitor all services
- Frontend hot reload should complete in <3s
- Backend API responses should be <200ms in development
- Database queries should use proper indexes (check EXPLAIN ANALYZE)

## Performance Optimization

### Frontend
- Enable React production mode for builds
- Use Next.js Image optimization
- Implement proper caching strategies
- Minimize bundle size with code splitting

### Backend
- Use async/await for I/O operations
- Implement proper database indexing
- Use connection pooling
- Enable Gunicorn workers in production

### Database
- Indexes on user_id, completed, created_at fields
- Connection pooling with PgBouncer if needed
- Query optimization with EXPLAIN ANALYZE
- Regular vacuuming and maintenance

## Production Deployment

### Environment Variables
- Change JWT secrets for production
- Update database URL to Neon Serverless
- Set proper CORS origins
- Configure SSL certificates

### Deployment Steps
1. Build frontend: `cd frontend && npm run build`
2. Containerize backend with proper production settings
3. Deploy to Vercel (frontend) and container service (backend)
4. Apply database migrations
5. Monitor application health

## Security Checklist

- [x] Passwords hashed with bcrypt
- [x] JWT tokens in httpOnly cookies
- [x] User data isolated by user_id
- [x] SQL injection prevention via SQLModel
- [x] XSS prevention via input sanitization
- [x] 404 responses for unauthorized access (not 403)
- [x] Rate limiting on authentication endpoints
- [x] Input validation on all endpoints