#!/bin/bash

# This script automates the deployment of the entire application stack to Minikube.

# Exit immediately if a command exits with a non-zero status.
set -e

NAMESPACE="scalable-services"

echo "🚀 Starting Minikube Deployment..."

# --- 1. Check and Start Minikube ---
echo "--> Checking Minikube status..."
if ! minikube status &> /dev/null; then
    echo "--> Minikube is not running. Starting Minikube with recommended resources..."
    minikube start --memory=6g --cpus=4
else
    echo "--> Minikube is already running."
fi

# --- 2. Create Namespace ---
echo "--> Creating namespace '${NAMESPACE}' if it doesn't exist..."
kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

# --- 3. Set Docker Environment ---
echo "--> Setting Docker environment to Minikube's daemon..."
eval $(minikube -p minikube docker-env)
echo "--> Docker environment is now pointing to Minikube."

# --- 4. Build Docker Images ---
echo "--> Building application Docker images using the Makefile..."
make build-collector build-processor build-service build-demo
echo "--> Docker images built successfully inside Minikube."

# --- 5. Deploy to Kubernetes ---
echo "--> Applying all Kubernetes manifests from the kube/ directory to namespace '${NAMESPACE}'..."
kubectl apply -f kube/ -n "${NAMESPACE}"
echo "--> Kubernetes resources deployed."

# --- 6. Provide Access Instructions ---
echo ""
echo "✅ Deployment to Minikube is complete!"
echo ""
echo "To access the services, you can run the following commands in your terminal:"
echo "--------------------------------------------------------------------------"
echo "  # To get the URL for the frontend application and open it:"
echo "  minikube service frontend -n ${NAMESPACE}"
echo ""
echo "  # To get the URL for the Adminer database tool and open it:"
echo "  minikube service adminer -n ${NAMESPACE}"
echo ""
echo "  # To get the URL for the backend Events API:"
echo "  minikube service events-api -n ${NAMESPACE} --url"
echo "--------------------------------------------------------------------------"