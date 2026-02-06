# Evolution of Todo

This is a multi-phase educational software project demonstrating the evolution of a simple CLI todo application into a cloud-native, AI-powered, event-driven distributed system.

## Phase IV: Local Kubernetes Deployment

The application has been containerized and deployed to Kubernetes using Helm charts. This enables scalable, cloud-native deployment patterns while preserving all Phase III functionality.

### Prerequisites

- Docker Desktop
- Minikube
- Helm 3
- kubectl

### Quick Start

1. Start Minikube:
   ```bash
   minikube start --memory=4096 --cpus=2
   ```

2. Deploy using Helm:
   ```bash
   # Set Docker environment to use Minikube
   eval $(minikube docker-env)

   # Build images
   docker build -t todo-backend:latest -f docker/Dockerfile.backend backend/
   docker build -t todo-frontend:latest -f docker/Dockerfile.frontend frontend/

   # Load images to Minikube
   minikube image load todo-backend:latest
   minikube image load todo-frontend:latest

   # Deploy with Helm
   kubectl create namespace todo-app
   helm install todo-backend k8s/charts/todo-backend --namespace todo-app
   helm install todo-frontend k8s/charts/todo-frontend --namespace todo-app
   ```

3. Access the application:
   ```bash
   # Get service information
   kubectl get svc -n todo-app

   # If using Minikube, get access URL
   minikube service todo-frontend -n todo-app --url
   ```

### Architecture

- **Frontend**: Next.js application deployed as Deployment with NodePort Service
- **Backend**: FastAPI application deployed as Deployment with ClusterIP Service
- **Communication**: Frontend connects to backend via internal DNS (`http://todo-backend:7860`)
- **Persistence**: Uses PersistentVolumes for data storage (configurable in Helm values)

For detailed deployment instructions, see [docs/kubernetes-deployment.md](docs/kubernetes-deployment.md).