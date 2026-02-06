# Kubernetes Production Best Practices

## Deployment Configuration

### Resource Management
- Always define resource requests and limits for containers
- Use Quality of Service (QoS) classes appropriately
- Monitor resource utilization regularly

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"
```

### Health Checks
- Implement liveness and readiness probes
- Use appropriate initial delay and timeout values
- Distinguish between liveness (is app healthy?) and readiness (is app ready to serve?)

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Security
- Run containers as non-root users
- Use minimal base images
- Implement security contexts
- Limit capabilities

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 2000
containers:
- name: app
  securityContext:
    allowPrivilegeEscalation: false
    readOnlyRootFilesystem: true
    runAsNonRoot: true
    capabilities:
      drop: ["ALL"]
```

## Production Patterns

### Rolling Updates
- Configure rolling update strategy
- Set appropriate surge and unavailable values

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%
    maxUnavailable: 25%
```

### Pod Disruption Budgets
- Define PDBs to prevent excessive downtime during disruptions

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: my-app
```

### Node Affinity/Anti-Affinity
- Distribute pods across nodes for high availability

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - my-app
        topologyKey: kubernetes.io/hostname
```

## Monitoring and Observability

### Labels and Annotations
- Use consistent labeling strategy
- Include environment, version, and owner information

```yaml
metadata:
  labels:
    app: my-app
    version: v1.2.3
    environment: production
    team: backend
  annotations:
    description: Production deployment for my-app
    deployment-date: "2023-10-01"
```

### Logging
- Use structured logging
- Direct logs to stdout/stderr
- Consider centralized logging solutions

### Metrics
- Expose application metrics
- Use Prometheus exposition format
- Implement health check endpoints