---
name: docker-fastapi
description: Comprehensive Docker orchestration for deploying Python/FastAPI applications from development to professional production systems. Use for containerizing FastAPI applications with optimized Dockerfiles, multi-stage builds, security best practices, production-ready configurations, and deployment orchestration with docker-compose.
---

# Docker FastAPI

Comprehensive Docker orchestration for deploying Python/FastAPI applications from development to professional production systems.

## Overview

This skill provides complete Docker orchestration capabilities for Python/FastAPI applications. It includes tools for generating optimized Dockerfiles, validating configurations against security best practices, creating production-ready docker-compose files, and implementing proper development workflows. Whether you're starting a new FastAPI project or containerizing an existing one, this skill helps you create efficient, secure, and scalable containerized deployments.

## Core Capabilities

### 1. Dockerfile Generation
Automatically create optimized Dockerfiles for different environments:
- **Development**: Hot-reload enabled for rapid development cycles
- **Production**: Multi-stage builds with security best practices
- **Customizable**: Flexible options for Python versions, ASGI servers, and configuration

### 2. Best Practices Validation
Validate Docker configurations against security and performance standards:
- Non-root user implementation
- Multi-stage build verification
- Health check presence
- Proper resource allocation
- Package manager cleanup

### 3. Deployment Orchestration
Generate docker-compose configurations for complete deployment stacks:
- Service definitions with proper resource limits
- Health checks and restart policies
- Volume and network configurations
- Environment-specific deployments

## Quick Start

### For New FastAPI Projects
1. Generate a production Dockerfile:
   ```bash
   python scripts/generate_dockerfile.py --type production --python-version 3.11
   ```

2. Generate docker-compose for orchestration:
   ```bash
   python scripts/generate_dockerfile.py --generate-compose
   ```

3. Validate your configuration:
   ```bash
   python scripts/validate_dockerfile.py
   ```

### For Existing FastAPI Projects
1. Analyze your current Dockerfile:
   ```bash
   python scripts/validate_dockerfile.py --file path/to/your/Dockerfile
   ```

2. Generate optimized replacement:
   ```bash
   python scripts/generate_dockerfile.py --type production --output new.Dockerfile
   ```

## Detailed Usage

### Dockerfile Types

#### Development (`--type development`)
- Enables hot-reload with `--reload` flag
- Installs development dependencies
- Maps local source code for live updates
- Suitable for local development workflow

#### Production (`--type production`)
- Multi-stage build for minimal image size
- Non-root user for security
- Health checks for container monitoring
- Optimized for performance and security

#### Multistage (`--type multistage`) - Default
- Combines build and runtime stages
- Reduces final image size
- Separates build dependencies from runtime
- Best balance of security and performance

### Using Different ASGI Servers

By default, the production Dockerfile uses Uvicorn with multiple workers. For high-load scenarios, you can use Gunicorn with Uvicorn workers:

```bash
python scripts/generate_dockerfile.py --type production --use-gunicorn
```

### Environment-Specific Configuration

The generated configurations include environment variables for different deployment stages:

- `ENVIRONMENT`: Set to 'development', 'staging', or 'production'
- `LOG_LEVEL`: Control logging verbosity
- `DEBUG`: Enable/disable debug features
- `WORKERS`: Number of application workers (production)

## Scripts

### `generate_dockerfile.py`
Main utility for creating Docker configurations with various options.

**Common Usage:**
```bash
# Production multi-stage build
python scripts/generate_dockerfile.py --type production --python-version 3.11

# Development with hot-reload
python scripts/generate_dockerfile.py --type development --port 3000

# With docker-compose generation
python scripts/generate_dockerfile.py --generate-compose --service-name my-fastapi-app
```

### `validate_dockerfile.py`
Analyzes Dockerfiles for adherence to best practices and security standards.

**Validation:**
```bash
# Validate existing Dockerfile
python scripts/validate_dockerfile.py --file Dockerfile

# Generate .dockerignore
python scripts/validate_dockerfile.py --generate-dockerignore
```

## References

### `references/docker-best-practices.md`
Comprehensive guide to Docker best practices including multi-stage builds, security considerations, performance optimization, and FastAPI-specific configurations.

### `references/fastapi-docker-patterns.md`
FastAPI-specific Docker deployment patterns covering development workflows, environment-specific configurations, microservice architecture, and scaling strategies.

## Assets

### `assets/Dockerfile.dev`
Template for development-focused Dockerfiles with hot-reload capabilities.

### `assets/Dockerfile.prod`
Template for production-optimized multi-stage Dockerfiles with security best practices.

### `assets/docker-compose.yml`
Production-ready docker-compose template with health checks, resource limits, and proper service configuration.

### `assets/.dockerignore`
Comprehensive .dockerignore template for Python/FastAPI applications to exclude unnecessary files from builds.

## Advanced Topics

### Multi-Architecture Builds
Use Docker Buildx for multi-platform support:
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t my-fastapi-app .
```

### Secrets Management
For production deployments, use Docker secrets:
```yaml
services:
  fastapi-app:
    secrets:
      - db_password
      - jwt_secret
```

### Health Checks
The generated Dockerfiles include health checks for container monitoring:
```dockerfile
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1
```

## Troubleshooting

### Common Issues
1. **Permission Errors**: Ensure non-root user is properly configured
2. **Missing Dependencies**: Verify all required packages are in requirements.txt
3. **Port Conflicts**: Check exposed ports don't conflict with other services
4. **Memory Issues**: Adjust worker count and memory limits based on application needs

### Performance Tuning
- Adjust worker count based on CPU cores (typically 2x + 1)
- Set appropriate memory limits to prevent OOM kills
- Use connection pooling for database connections
- Implement proper caching strategies
