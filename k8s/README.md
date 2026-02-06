# Kubernetes Deployment for Todo Application

This directory contains all Kubernetes manifests and Helm charts for deploying the Todo application with AI chatbot functionality to a local Kubernetes cluster.

## Prerequisites

- Docker Desktop with Kubernetes enabled OR Minikube
- Helm 3
- kubectl
- Docker images built and available locally

## Quick Start with Raw Manifests

1. Ensure your Docker images are built and available:
   ```bash
   # From the project root
   cd backend && docker build -t todo-backend:latest . && cd ..
   cd frontend && docker build -t todo-frontend:latest . && cd ..
   ```

2. Load images to Minikube (if using Minikube):
   ```bash
   minikube image load todo-backend:latest
   minikube image load todo-frontend:latest
   ```

3. Deploy using raw manifests:
   ```bash
   ./k8s/scripts/deploy.sh
   ```

## Deploy with Helm

1. Ensure your Docker images are built and available (as above)

2. Deploy with Helm:
   ```bash
   # Create namespace
   kubectl create namespace todo-app

   # Install backend
   helm install todo-backend k8s/charts/todo-backend --namespace todo-app

   # Install frontend
   helm install todo-frontend k8s/charts/todo-frontend --namespace todo-app
   ```

## Verify Deployment

Check the status of your deployment:
```bash
kubectl get pods,svc -n todo-app
```

Run health checks:
```bash
./k8s/scripts/health-check.sh
```

## Access the Application

If using Minikube:
```bash
minikube service todo-frontend -n todo-app --url
```

Or check the NodePort assigned:
```bash
kubectl get svc todo-frontend -n todo-app
```

## Configuration

The application uses a ConfigMap to manage environment variables. You can customize the values in `k8s/manifests/configmap.yaml` to match your environment.

## Troubleshooting

1. Check pod status:
   ```bash
   kubectl get pods -n todo-app
   ```

2. Check pod logs:
   ```bash
   kubectl logs -l app=todo-backend -n todo-app
   kubectl logs -l app=todo-frontend -n todo-app
   ```

3. Check service endpoints:
   ```bash
   kubectl get endpoints -n todo-app
   ```

## Clean Up

To remove the deployment:
```bash
kubectl delete -f k8s/manifests/ -n todo-app
# OR with Helm
helm uninstall todo-backend todo-frontend -n todo-app
```