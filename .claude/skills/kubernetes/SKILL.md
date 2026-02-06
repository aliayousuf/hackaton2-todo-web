---
name: kubernetes
description: Comprehensive Kubernetes orchestration for deploying and scaling containerized applications from hello world to professional production systems. Use for managing deployments, services, scaling, resource management, and production configurations with security best practices.
---

# Kubernetes Orchestration Skill

## Overview

This skill provides comprehensive capabilities for managing Kubernetes deployments, from simple hello-world applications to complex production systems. It includes tools for deployment, scaling, resource management, security configuration, and best practices implementation.

## Quick Start

### Hello World Deployment
Deploy a simple application to Kubernetes:
```bash
python scripts/deploy_app.py --name my-hello-app --image nginx:latest --port 80 --replicas 1 --create-service
```

### Production Deployment
Create a production-ready deployment with security and monitoring:
```bash
python scripts/prod_deploy.py --name my-prod-app --image mycompany/app:v1.0 --port 8080 --replicas 3 --create-hpa --create-ingress --hostname myapp.example.com --cpu-limit 500m --memory-limit 1Gi
```

### Scaling Applications
Manually scale an application:
```bash
python scripts/scale_app.py --name my-app --replicas 5 --monitor
```

Or perform autoscaling based on current load:
```bash
python scripts/scale_app.py --name my-app --autoscale --min-replicas 2 --max-replicas 10
```

## Core Capabilities

### 1. Application Deployment
- Simple deployments for development and testing
- Production-ready configurations with security and monitoring
- Support for environment variables, resource limits, and health checks
- Service creation and networking configuration

### 2. Scaling Operations
- Manual scaling with progress monitoring
- Automatic scaling based on resource utilization
- Horizontal Pod Autoscaler (HPA) configuration
- Load-based scaling decisions

### 3. Production Features
- Security best practices implementation
- Resource management and quotas
- Health checks and readiness probes
- TLS termination and ingress configuration
- Pod Disruption Budgets (PDBs)

## Deployment Workflows

### Basic Deployment Workflow
1. **Prepare your container image** - Ensure your application is containerized
2. **Choose deployment type** - Simple or production-ready
3. **Configure resources** - Set CPU/memory limits and requests
4. **Deploy** - Execute the deployment script
5. **Verify** - Check deployment status and service accessibility

### Production Deployment Workflow
1. **Security Review** - Implement security contexts and network policies
2. **Resource Planning** - Define requests, limits, and quotas
3. **Monitoring Setup** - Configure health checks and metrics
4. **Scalability Planning** - Set up HPA and PDBs
5. **Network Configuration** - Set up ingress and TLS

## Common Tasks

### Deploy a New Application
Use `scripts/deploy_app.py` for basic deployments:
- Specify application name, image, and port
- Set initial replica count
- Optionally create a service
- Add environment variables if needed

### Scale Existing Applications
Use `scripts/scale_app.py` for scaling operations:
- Manual scaling to specific replica count
- Monitor scaling progress
- Auto-scaling based on resource usage
- Set min/max bounds for safety

### Upgrade Production Applications
Use `scripts/prod_deploy.py` for production upgrades:
- Configure blue-green or canary deployment patterns
- Set up proper health checks before traffic switch
- Monitor during and after deployment
- Configure rollback procedures

## Security Guidelines

### Container Security
- Run containers as non-root users
- Implement read-only root filesystem
- Drop unnecessary capabilities
- Use minimal base images

### Network Security
- Implement Network Policies to restrict traffic
- Use TLS for all external communications
- Configure proper ingress rules
- Segment namespaces appropriately

### Secret Management
- Store sensitive data in Kubernetes Secrets
- Use external secret stores for production
- Rotate secrets regularly
- Limit secret access with RBAC

## Production Best Practices

### Resource Management
- Always set resource requests and limits
- Use appropriate QoS classes
- Monitor resource utilization regularly
- Right-size containers based on actual usage

### Availability
- Configure Pod Disruption Budgets
- Distribute pods across nodes with anti-affinity
- Set up proper health checks
- Maintain adequate replica counts

### Monitoring and Observability
- Implement structured logging
- Expose application metrics
- Set up alerting for key metrics
- Use distributed tracing for microservices

## References

For detailed information about specific topics, consult the following reference materials:

- [Production Best Practices](references/best_practices.md) - Detailed configuration patterns for production environments
- [Deployments and Services](references/deployments_and_services.md) - Complete guide to Kubernetes workload and networking resources
- [Scaling and Resource Management](references/scaling_and_resources.md) - Advanced scaling techniques and resource optimization
- [Security and Networking](references/security_networking.md) - Security configuration and network policies

## Troubleshooting

### Common Issues
- **Insufficient resources**: Increase resource limits or reduce replica count
- **Image pull errors**: Verify image name and registry access
- **Service connectivity**: Check service configuration and network policies
- **Scaling failures**: Verify HPA configuration and metrics availability

### Debugging Commands
- `kubectl get pods -n <namespace>` - Check pod status
- `kubectl describe deployment <name>` - Get deployment details
- `kubectl logs <pod-name>` - View application logs
- `kubectl top nodes` - Check cluster resource usage
