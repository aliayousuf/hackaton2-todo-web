#!/bin/bash

# Health check script for Todo application in Kubernetes

set -e

NAMESPACE=${NAMESPACE:-default}

echo "Checking health of Todo application in namespace: $NAMESPACE"

# Check if pods are running
echo "Checking pod status..."
kubectl get pods -n $NAMESPACE

# Check backend service health
echo "Checking backend health endpoint..."
BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app=todo-backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ ! -z "$BACKEND_POD" ]; then
    echo "Testing backend pod: $BACKEND_POD"
    kubectl exec -n $NAMESPACE $BACKEND_POD -- curl -f http://localhost:7860/health || echo "Backend health check failed"
else
    echo "No backend pod found"
fi

# Check frontend service accessibility
echo "Checking frontend service..."
FRONTEND_POD=$(kubectl get pods -n $NAMESPACE -l app=todo-frontend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ ! -z "$FRONTEND_POD" ]; then
    echo "Testing frontend pod: $FRONTEND_POD"
    kubectl exec -n $NAMESPACE $FRONTEND_POD -- curl -f http://localhost:3000/ || echo "Frontend health check failed"
else
    echo "No frontend pod found"
fi

# Check service connectivity
echo "Checking service connectivity..."
kubectl get services -n $NAMESPACE

# Check ingress (if exists)
echo "Checking ingress..."
kubectl get ingress -n $NAMESPACE || echo "No ingress found (may be intentional)"

# Check resource utilization
echo "Checking resource utilization..."
kubectl top pods -n $NAMESPACE || echo "Metrics server may not be available"

echo "Health check completed!"