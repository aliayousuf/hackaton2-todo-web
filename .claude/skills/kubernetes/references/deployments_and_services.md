# Kubernetes Deployments and Services

## Deployments

### Basic Deployment Structure
A Deployment controller provides declarative updates for Pods and ReplicaSets.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Deployment Strategies
- **Recreate**: Destroy all old pods before creating new ones (causes downtime)
- **RollingUpdate**: Gradually replace old pods with new ones (default)

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1        # Additional pods during update
    maxUnavailable: 1  # Maximum unavailable pods during update
```

### Common Deployment Parameters
- `replicas`: Desired number of pods
- `revisionHistoryLimit`: Number of old ReplicaSets to retain (default: 10)
- `progressDeadlineSeconds`: Deadline for rollout (default: 600 seconds)

## Services

### Service Types
1. **ClusterIP** (default): Internal cluster communication
2. **NodePort**: Accessible via `<NodeIP>:<NodePort>`
3. **LoadBalancer**: External load balancer from cloud provider
4. **ExternalName**: Maps service to DNS name

### ClusterIP Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: ClusterIP
```

### LoadBalancer Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```

## ConfigMaps and Secrets

### ConfigMap for Configuration
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  config.properties: |
    database.url=jdbc:mysql://localhost:3306/mydb
    database.user=myuser
```

### Secret for Sensitive Data
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  password: cGFzc3dvcmQ=  # Base64 encoded
```

## Volumes

### Persistent Volume Claims
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: storage-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### Using Volumes in Pods
```yaml
spec:
  containers:
  - name: app
    image: myapp
    volumeMounts:
    - name: storage-volume
      mountPath: /data
  volumes:
  - name: storage-volume
    persistentVolumeClaim:
      claimName: storage-claim
```

## Ingress Controllers

### Basic Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

## Common Commands

### Managing Deployments
- `kubectl get deployments` - List deployments
- `kubectl describe deployment <name>` - Show deployment details
- `kubectl scale deployment <name> --replicas=<count>` - Scale deployment
- `kubectl set image deployment/<name> <container>=<new-image>` - Update image
- `kubectl rollout status deployment/<name>` - Check rollout status
- `kubectl rollout undo deployment/<name>` - Rollback deployment

### Managing Services
- `kubectl get services` - List services
- `kubectl describe service <name>` - Show service details
- `kubectl expose deployment <name> --port=<port>` - Create service from deployment

### Debugging
- `kubectl get pods` - List pods
- `kubectl logs <pod-name>` - View pod logs
- `kubectl exec -it <pod-name> -- /bin/sh` - Execute command in pod
- `kubectl get events` - View cluster events