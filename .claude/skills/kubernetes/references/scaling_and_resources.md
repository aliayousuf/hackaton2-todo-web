# Kubernetes Scaling and Resource Management

## Horizontal Pod Autoscaler (HPA)

### HPA Configuration
HPA automatically scales the number of pods based on observed metrics.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### HPA Metrics Types
1. **Resource Metrics**: CPU and memory utilization
2. **Custom Metrics**: Application-specific metrics
3. **External Metrics**: Metrics from external sources

### Creating HPA with kubectl
```bash
kubectl autoscale deployment my-app --cpu-percent=70 --min=2 --max=10
```

## Vertical Pod Autoscaler (VPA)

### VPA Configuration
VPA adjusts CPU and memory requests/limits for pods.

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Auto"  # Off, Initial, Auto
```

## Resource Management

### Compute Resources
- **CPU**: Measured in cores or millicores (m)
  - 1 CPU = 1000m
  - Fractional values allowed (e.g., 500m = 0.5 CPU)
- **Memory**: Measured in bytes with SI suffixes
  - E, P, T, G, M, K (e.g., 1Gi = 1024^3 bytes)
  - Ei, Pi, Ti, Gi, Mi, Ki (e.g., 1Gi = 1024^3 bytes)

### Resource Requests vs Limits
- **Requests**: Minimum guaranteed resources
- **Limits**: Maximum allowed resources

```yaml
resources:
  requests:
    memory: "64Mi"    # Minimum memory guaranteed
    cpu: "250m"       # Minimum CPU guaranteed
  limits:
    memory: "128Mi"   # Maximum memory allowed
    cpu: "500m"       # Maximum CPU allowed
```

### Quality of Service (QoS) Classes
1. **Guaranteed**: Limits and requests equal for all resources
2. **Burstable**: Limits higher than requests
3. **BestEffort**: No limits or requests specified

## Pod Disruption Budgets (PDB)

### PDB Configuration
PDBs ensure a minimum number of pods remain available during disruptions.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2
  # OR
  # maxUnavailable: 1
  selector:
    matchLabels:
      app: my-app
```

## Cluster Autoscaler

### Concept
Cluster Autoscaler automatically adjusts the size of the Kubernetes cluster based on resource demands.

- Adds nodes when pods can't be scheduled due to resource constraints
- Removes nodes when they've been underutilized for extended periods
- Works with cloud providers (AWS, GCP, Azure)

## Scaling Strategies

### Manual Scaling
```bash
# Scale to specific number of replicas
kubectl scale deployment my-app --replicas=5

# Scale based on current count
kubectl scale deployment my-app --current-replicas=3 --replicas=6
```

### Automated Scaling
1. **HPA**: Scale based on CPU/memory usage
2. **KEDA**: Event-driven autoscaling
3. **Custom controllers**: Application-specific scaling logic

### Blue-Green Deployments
- Maintain two identical production environments
- Switch traffic between environments during deployment
- Reduces deployment risk and enables quick rollbacks

### Canary Deployments
- Gradually shift traffic to new version
- Monitor metrics during rollout
- Control rollout percentage

## Resource Quotas

### Namespace Resource Quotas
Limit resource consumption per namespace.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: my-namespace
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 4Gi
    limits.cpu: "8"
    limits.memory: 8Gi
    persistentvolumeclaims: "10"
```

### Object Count Quotas
Limit the number of objects in a namespace.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
  namespace: my-namespace
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
```

## Scaling Best Practices

### HPA Best Practices
- Set appropriate resource requests
- Monitor HPA metrics regularly
- Use multiple metrics when needed
- Account for application startup time in readiness probes

### Resource Management Best Practices
- Right-size containers based on actual usage
- Monitor resource utilization continuously
- Use vertical scaling for steady-state workloads
- Use horizontal scaling for variable workloads
- Implement proper monitoring and alerting

### Scaling Patterns
- **Predictive Scaling**: Based on known patterns
- **Reactive Scaling**: Based on current metrics
- **Scheduled Scaling**: Based on planned events