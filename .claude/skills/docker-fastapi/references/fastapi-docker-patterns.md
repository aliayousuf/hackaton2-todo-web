# FastAPI Docker Deployment Patterns

## Development vs Production Patterns

### Development Pattern
For local development with hot reloading:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install watchfiles  # For hot reload

# Copy application
COPY . .

# Create non-root user
RUN groupadd -g 1001 -S fastapi && \
    adduser -S fastapi -u 1001 -G fastapi

USER fastapi

EXPOSE 8000

# Use uvicorn with reload for development
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### Production Pattern
For production deployments with optimized performance:

```dockerfile
#syntax=docker/dockerfile:1

# === Build stage ===
FROM python:3.11-slim AS builder

ENV LANG=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

WORKDIR /app

RUN python -m venv /app/venv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install gunicorn uvicorn[standard]

# === Production stage ===
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

# Create non-root user
RUN groupadd -g 1001 -S fastapi && \
    adduser -S fastapi -u 1001 -G fastapi

COPY app.py ./
COPY --from=builder /app/venv /app/venv

USER fastapi

EXPOSE 8000

# Use Gunicorn with Uvicorn worker for production
ENTRYPOINT ["gunicorn", "--worker-class", "uvicorn.workers.UvicornWorker", \
    "--workers", "4", "--worker-connections", "1000", \
    "--max-requests", "1000", "--max-requests-jitter", "100", \
    "--bind", "0.0.0.0:8000", "app:app"]
```

## Environment-Specific Deployments

### Testing Environment
Lightweight image optimized for CI/CD:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install all dependencies including dev dependencies
COPY requirements.txt requirements-test.txt ./
RUN pip install --no-cache-dir -r requirements.txt -r requirements-test.txt

COPY . .

# Create non-root user
RUN groupadd -g 1001 -S fastapi && \
    adduser -S fastapi -u 1001 -G fastapi

USER fastapi

CMD ["pytest", "tests/", "-v"]
```

### Staging Environment
Production-like configuration with additional monitoring:

```dockerfile
#syntax=docker/dockerfile:1

FROM python:3.11-slim AS builder

WORKDIR /app
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install gunicorn uvicorn[standard] pytest

FROM python:3.11-slim

WORKDIR /app
ENV PATH="/app/venv/bin:$PATH"

# Create non-root user
RUN groupadd -g 1001 -S fastapi && \
    adduser -S fastapi -u 1001 -G fastapi

COPY --from=builder /app/venv /app/venv
COPY . .

USER fastapi

EXPOSE 8000

# Enable detailed logging for staging
ENV LOG_LEVEL=debug
ENV ENVIRONMENT=staging

ENTRYPOINT ["gunicorn", "--worker-class", "uvicorn.workers.UvicornWorker", \
    "--workers", "2", "--bind", "0.0.0.0:8000", "--access-logfile", "-", \
    "--error-logfile", "-", "app:app"]
```

## Microservice Architecture Pattern

### API Gateway Pattern
Container with reverse proxy capabilities:

```dockerfile
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check for nginx
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD nginx -t || exit 1

EXPOSE 80 443
```

### Sidecar Pattern
Auxiliary service alongside main application:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements-sidecar.txt .
RUN pip install --no-cache-dir -r requirements-sidecar.txt

COPY sidecar.py .

# Create non-root user
RUN groupadd -g 1001 -S sidecar && \
    adduser -S sidecar -u 1001 -G sidecar

USER sidecar

CMD ["python", "sidecar.py"]
```

## Scaling and Orchestration Patterns

### Docker Compose with External Services
Pattern for connecting to external databases, caches, etc.:

```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://external-db:5432/myapp
      - REDIS_URL=redis://external-redis:6379
    ports:
      - "8000:8000"
    depends_on:
      - database
      - cache
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  migration:
    build: .
    command: python manage.py migrate
    environment:
      - DATABASE_URL=postgresql://external-db:5432/myapp
    depends_on:
      - database
```

### Blue-Green Deployment Ready
Configuration that supports blue-green deployments:

```dockerfile
FROM python:3.11-slim AS builder

WORKDIR /app
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim

WORKDIR /app
ENV PATH="/app/venv/bin:$PATH"

# Create non-root user
RUN groupadd -g 1001 -S fastapi && \
    adduser -S fastapi -u 1001 -G fastapi

# Copy from builder
COPY --from=builder /app/venv /app/venv
COPY . .

USER fastapi

EXPOSE 8000

# Use environment variables for configuration
ENV PORT=8000
ENV WORKERS=4

CMD ["sh", "-c", "exec uvicorn app:app --host 0.0.0.0 --port $PORT --workers $WORKERS"]
```

## Monitoring and Observability

### Container Labels for Monitoring
Include labels for container identification:

```dockerfile
LABEL maintainer="team@example.com"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/your-org/your-app"
LABEL org.opencontainers.image.description="FastAPI application container"
LABEL org.opencontainers.image.licenses="MIT"
```

### Logging Configuration
Proper logging setup for containerized environments:

```dockerfile
# In your FastAPI app
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
```