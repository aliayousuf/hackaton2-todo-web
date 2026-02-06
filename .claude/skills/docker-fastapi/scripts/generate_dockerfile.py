#!/usr/bin/env python3
"""
Dockerfile generator for Python/FastAPI applications

Generates optimized Dockerfiles for FastAPI applications following Docker best practices.
Supports both development and production configurations.
"""

import argparse
import os
from pathlib import Path


def generate_base_dockerfile(python_version="3.11", use_multistage=True):
    """Generate a basic Dockerfile for FastAPI applications."""

    if use_multistage:
        dockerfile_content = f'''#syntax=docker/dockerfile:1

# === Build stage: Install dependencies and create virtual environment ===
FROM python:{python_version}-slim AS builder

ENV LANG=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

WORKDIR /app

RUN python -m venv /app/venv
COPY requirements.txt .

# Install system dependencies if needed
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

# === Final stage: Create minimal runtime image ===
FROM python:{python_version}-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

# Create non-root user for security
RUN groupadd -g 1001 -S fastapi && \\
    adduser -S fastapi -u 1001 -G fastapi && \\
    chown -R fastapi:fastapi /app

COPY app.py ./
COPY --from=builder /app/venv /app/venv

# Switch to non-root user
USER fastapi

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

ENTRYPOINT ["/app/venv/bin/python", "app.py"]
'''
    else:
        dockerfile_content = f'''FROM python:{python_version}-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    LANG=C.UTF-8

# Install system dependencies if needed
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create non-root user for security
RUN groupadd -g 1001 -S fastapi && \\
    adduser -S fastapi -u 1001 -G fastapi && \\
    chown -R fastapi:fastapi /app

# Switch to non-root user
USER fastapi

EXPOSE 8000

CMD ["python", "app.py"]
'''

    return dockerfile_content


def generate_development_dockerfile(python_version="3.11"):
    """Generate a Dockerfile optimized for development."""

    dockerfile_content = f'''FROM python:{python_version}-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    LANG=C.UTF-8

# Install system dependencies if needed
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Hot reload support
RUN pip install watchfiles

# Create non-root user for security
RUN groupadd -g 1001 -S fastapi && \\
    adduser -S fastapi -u 1001 -G fastapi && \\
    chown -R fastapi:fastapi /app

# Switch to non-root user
USER fastapi

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
'''

    return dockerfile_content


def generate_production_dockerfile(python_version="3.11", use_gunicorn=False):
    """Generate a Dockerfile optimized for production."""

    if use_gunicorn:
        entrypoint = 'ENTRYPOINT ["gunicorn", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "app:app"]'
        install_cmd = 'RUN pip install --no-cache-dir -r requirements.txt && pip install gunicorn uvicorn[standard]'
    else:
        entrypoint = 'ENTRYPOINT ["/app/venv/bin/uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]'
        install_cmd = 'RUN pip install --no-cache-dir -r requirements.txt && pip install uvicorn[standard]'

    dockerfile_content = f'''#syntax=docker/dockerfile:1

# === Build stage: Install dependencies and create virtual environment ===
FROM python:{python_version}-slim AS builder

ENV LANG=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

WORKDIR /app

RUN python -m venv /app/venv
COPY requirements.txt .

# Install system dependencies if needed
# RUN apt-get update && apt-get install -y gcc && rm -rf /var/lib/apt/lists/*

{install_cmd}

# === Final stage: Create minimal runtime image ===
FROM python:{python_version}-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1
ENV PATH="/app/venv/bin:$PATH"

# Create non-root user for security
RUN groupadd -g 1001 -S fastapi && \\
    adduser -S fastapi -u 1001 -G fastapi && \\
    chown -R fastapi:fastapi /app

COPY app.py ./
COPY --from=builder /app/venv /app/venv

# Switch to non-root user
USER fastapi

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

{entrypoint}
'''

    return dockerfile_content


def generate_docker_compose(service_name="fastapi-app", port=8000):
    """Generate a docker-compose.yml file for the application."""

    compose_content = f'''version: '3.8'

services:
  {service_name}:
    build: .
    restart: unless-stopped
    ports:
      - "{port}:{port}"
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=info
    volumes:
      - ./logs:/app/logs  # Mount logs directory
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:{port}/docs"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
'''

    return compose_content


def main():
    parser = argparse.ArgumentParser(description="Generate Docker configurations for FastAPI applications")
    parser.add_argument("--type", choices=["production", "development", "multistage"], default="multistage",
                        help="Type of Dockerfile to generate (default: multistage)")
    parser.add_argument("--python-version", default="3.11",
                        help="Python version to use (default: 3.11)")
    parser.add_argument("--output", default="./Dockerfile",
                        help="Output file path (default: ./Dockerfile)")
    parser.add_argument("--generate-compose", action="store_true",
                        help="Also generate docker-compose.yml file")
    parser.add_argument("--service-name", default="fastapi-app",
                        help="Service name for docker-compose (default: fastapi-app)")
    parser.add_argument("--port", type=int, default=8000,
                        help="Port to expose (default: 8000)")
    parser.add_argument("--use-gunicorn", action="store_true",
                        help="Use Gunicorn as the WSGI server")

    args = parser.parse_args()

    # Generate Dockerfile based on type
    if args.type == "development":
        dockerfile_content = generate_development_dockerfile(args.python_version)
    elif args.type == "production":
        dockerfile_content = generate_production_dockerfile(args.python_version, args.use_gunicorn)
    else:  # multistage
        dockerfile_content = generate_base_dockerfile(args.python_version, True)

    # Write Dockerfile
    with open(args.output, 'w') as f:
        f.write(dockerfile_content)

    print(f"Dockerfile written to {args.output}")

    # Generate docker-compose.yml if requested
    if args.generate_compose:
        compose_content = generate_docker_compose(args.service_name, args.port)
        compose_path = "./docker-compose.yml"

        with open(compose_path, 'w') as f:
            f.write(compose_content)

        print(f"docker-compose.yml written to {compose_path}")


if __name__ == "__main__":
    main()