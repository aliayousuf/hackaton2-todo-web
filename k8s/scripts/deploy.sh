#!/bin/bash

# Deployment script for Todo application to Kubernetes

set -e

NAMESPACE=${NAMESPACE:-todo-app}

echo "Starting deployment of Todo application to namespace: $NAMESPACE"

# Create namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply the ConfigMap
kubectl apply -f ../manifests/configmap.yaml -n $NAMESPACE

# Apply the backend deployment and service
kubectl apply -f ../manifests/backend-deployment.yaml -n $NAMESPACE
kubectl apply -f ../manifests/backend-service.yaml -n $NAMESPACE

# Apply the frontend deployment and service
kubectl apply -f ../manifests/frontend-deployment.yaml -n $NAMESPACE
kubectl apply -f ../manifests/frontend-service.yaml -n $NAMESPACE

# Apply the ingress
kubectl apply -f ../manifests/ingress.yaml -n $NAMESPACE

echo "Deployment completed!"
echo "To check status: kubectl get pods,svc -n $NAMESPACE"
echo "To check logs: kubectl logs -l app=todo-backend -n $NAMESPACE"