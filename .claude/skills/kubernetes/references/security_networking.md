# Kubernetes Security and Networking

## Security Best Practices

### Pod Security Standards
Three built-in policies for securing pods:

1. **privileged**: Unrestricted policy allowing full control
2. **baseline**: Minimally restrictive policy to allow common container features
3. **restricted**: Heavily restricted policy following security hardening practices

### Security Contexts
Configure privilege and access control settings for pods and containers.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 2000
  containers:
  - name: app-container
    image: my-app:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      capabilities:
        drop:
        - ALL
        add:
        - NET_BIND_SERVICE  # Only add necessary capabilities
```

### Network Policies
Control traffic flow between pods using network policies.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}  # Apply to all pods in namespace
  policyTypes:
  - Ingress
  - Egress
  ingress: []      # Deny all ingress
  egress: []       # Deny all egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-app-ingress
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: frontend
    ports:
    - protocol: TCP
      port: 8080
```

### RBAC (Role-Based Access Control)
Define permissions for users and service accounts.

```yaml
# Role definition
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: my-namespace
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]

# Role binding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: my-namespace
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## Secrets Management

### Basic Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded
  password: MWYyZDFlMmU2N2Rm  # base64 encoded
```

### Using Secrets in Pods
```yaml
spec:
  containers:
  - name: app
    image: my-app
    env:
    - name: USERNAME
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: username
    - name: PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: password
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: app-secret
```

### External Secrets
Consider using external secret stores like:
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager

## Namespaces and Isolation

### Namespace Definition
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    environment: prod
    team: backend
  annotations:
    description: Production namespace for backend services
```

### Resource Quotas per Namespace
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: prod-quota
  namespace: production
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "10"
    services.loadbalancers: "2"
```

## Ingress and Load Balancing

### Ingress Controller Setup
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
```

### Service Mesh (Istio example)
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp.example.com
  http:
  - match:
    - headers:
        canary:
          exact: "true"
    route:
    - destination:
        host: myapp
        subset: v2
      weight: 100
  - route:
    - destination:
        host: myapp
        subset: v1
      weight: 100
```

## Security Scanning and Compliance

### Image Security
- Scan container images for vulnerabilities
- Use trusted base images
- Keep images updated
- Implement admission controllers to reject vulnerable images

### Policy Enforcement
- Open Policy Agent (OPA) / Gatekeeper
- Kyverno
- Admission controllers for compliance

### Audit Logging
- Enable API server audit logging
- Monitor for suspicious activities
- Log all configuration changes

## Networking

### Service Discovery
Services provide stable IP addresses and DNS names for pods:

```yaml
# Pods can reach this service via:
# - my-service.default.svc.cluster.local
# - my-service.default (within same namespace)
# - my-service (within same namespace)
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

### Multi-cluster Networking
- Service mesh solutions (Istio, Linkerd)
- Gateway APIs
- VPN connections between clusters

## Security Tools and Solutions

### Runtime Security
- Falco: Behavioral activity monitoring
- Aqua Security: Container security platform
- Twistlock: Cloud native security

### Policy Management
- OPA/Gatekeeper: Declarative policy engine
- Kyverno: Kubernetes native policy engine
- Cilium: eBPF-based security observability

### Image Scanning
- Trivy: Vulnerability scanner
- Clair: Static analysis of containers
- Anchore: Full lifecycle image scanning