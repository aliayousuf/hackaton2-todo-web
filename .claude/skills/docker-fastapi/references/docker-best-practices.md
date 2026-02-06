# Docker Best Practices for Python/FastAPI Applications

## Multi-Stage Builds

Use multi-stage builds to create smaller, more secure production images by separating build-time dependencies from runtime requirements.

### Example Multi-Stage Build:
```dockerfile
# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app
RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
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
CMD ["/app/venv/bin/python", "main.py"]
```

## Security Best Practices

### 1. Use Non-Root User
Always run containers as a non-root user to minimize potential damage from security vulnerabilities.

```dockerfile
RUN groupadd -g 1001 -S fastapi && \
    adduser -S fastapi -u 1001 -G fastapi

USER fastapi
```

### 2. Minimal Base Images
Use minimal base images like `slim` or `alpine` variants to reduce attack surface:

```dockerfile
FROM python:3.11-slim  # Preferred
FROM python:3.11-alpine  # Even smaller
```

### 3. Health Checks
Implement health checks to monitor application status:

```dockerfile
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
```

## Performance Optimization

### 1. Layer Caching
Order Dockerfile instructions to maximize layer caching by putting frequently changing operations last:

```dockerfile
# Copy dependencies first (less likely to change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code last (changes frequently)
COPY . .
```

### 2. Clean Package Manager Cache
Reduce image size by cleaning package manager caches:

```dockerfile
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*
```

## FastAPI-Specific Considerations

### 1. ASGI Server Configuration
For production deployments, use a production-grade ASGI server like Uvicorn with multiple workers:

```dockerfile
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

Or use Gunicorn with Uvicorn worker class:

```dockerfile
CMD ["gunicorn", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "app:app"]
```

### 2. Environment Variables
Configure FastAPI applications using environment variables:

```dockerfile
ENV ENVIRONMENT=production
ENV LOG_LEVEL=info
ENV DEBUG=False
```

## Production Deployment Patterns

### 1. Docker Compose for Production
Use separate compose files for different environments:

```yaml
# docker-compose.prod.yaml
version: '3.8'

services:
  fastapi-app:
    build:
      context: .
      target: production
    restart: unless-stopped
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=postgresql://prod-db:5432/myapp
    ports:
      - "80:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 2. Resource Limits
Set resource limits to prevent resource exhaustion:

```yaml
services:
  fastapi-app:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## Common Pitfalls to Avoid

### ❌ Don'ts:
- Don't run containers as root user
- Don't copy entire directory before installing dependencies
- Don't use latest tag without version pinning
- Don't expose unnecessary ports
- Don't store secrets in Dockerfile

### ✅ Dos:
- Do use multi-stage builds
- Do implement health checks
- Do use .dockerignore to exclude unnecessary files
- Do set proper environment variables
- Do use specific version tags for base images