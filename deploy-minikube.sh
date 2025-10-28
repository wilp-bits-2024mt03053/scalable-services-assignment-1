#!/bin/bash
# ===============================================================
# Minikube Manager Script
# Cleans or deploys your entire app stack to Minikube.
# Usage:
#   ./minikube-manager.sh clean   # Clean everything
#   ./minikube-manager.sh deploy  # Start + build + deploy stack
# ===============================================================

set -e

NAMESPACE="scalable-services"
KUBE_DIR="kube"

# ------------- Utility Functions -------------
print_header() {
  echo ""
  echo "==============================================================="
  echo "🧠 $1"
  echo "==============================================================="
  echo ""
}

confirm_action() {
  read -p "⚠️  Are you sure you want to continue? (y/n): " choice
  case "$choice" in
    y|Y ) echo "Proceeding...";;
    * ) echo "Aborted."; exit 1;;
  esac
}

# ------------- Wait for Resources -------------
wait_for_resources() {
  print_header "⏳ WAITING FOR ALL RESOURCES TO BE READY"

  STATEFULSETS=(
    "zookeeper"
    "kafka"
    "postgres"
  )

  DEPLOYMENTS=(
    "events-collector"
    "events-processor"
    "events-api"
    "adminer"
    "frontend"
  )

  for sts in "${STATEFULSETS[@]}"; do
    echo "--> Waiting for StatefulSet '${sts}' to be ready..."
    if ! kubectl rollout status "statefulset/${sts}" -n "${NAMESPACE}" --timeout=2m; then
      echo "❌ StatefulSet '${sts}' failed to roll out."
      echo "   Check pod status with: kubectl get pods -n ${NAMESPACE} -l app=${sts}"
      echo "   Check pod logs with: kubectl logs -l app=${sts} -n ${NAMESPACE}"
      exit 1
    fi
    echo "--> ✅ StatefulSet '${sts}' is ready."
  done

  for deployment in "${DEPLOYMENTS[@]}"; do
    echo "--> Waiting for Deployment '${deployment}' to be ready..."
    if ! kubectl rollout status "deployment/${deployment}" -n "${NAMESPACE}" --timeout=2m; then
      echo "❌ Deployment '${deployment}' failed to roll out."
      echo "   Check pod status with: kubectl get pods -n ${NAMESPACE} -l app=${deployment}"
      echo "   Check pod logs with: kubectl logs -l app=${deployment} -n ${NAMESPACE}"
      exit 1
    fi
    echo "--> ✅ Deployment '${deployment}' is ready."
  done

  echo "🎉 All resources are ready!"
}

# ------------- CLEAN FUNCTION -------------
clean_minikube() {
  print_header "💣 CLEANING MINIKUBE CLUSTER"

  confirm_action

  echo "--> Stopping Minikube (if running)..."
  minikube stop || true

  echo "--> Deleting all Minikube profiles..."
  minikube delete --all --purge || true

  echo "--> Removing leftover Kubernetes config..."
  kubectl config delete-cluster minikube 2>/dev/null || true
  kubectl config delete-context minikube 2>/dev/null || true
  kubectl config unset current-context 2>/dev/null || true

  echo "--> Cleaning Docker resources..."
  docker system prune -af --volumes || true

  echo ""
  echo "✅ Minikube and Docker cleaned successfully!"
  echo "You now have a clean slate to redeploy."
  echo ""
}

# ------------- DEPLOY FUNCTION -------------
deploy_stack() {
  print_header "🚀 STARTING MINIKUBE DEPLOYMENT"

  echo "--> Checking Minikube status..."
  if ! minikube status &> /dev/null; then
      echo "--> Minikube is not running. Starting with recommended resources..."
      minikube start --memory=6g --cpus=4
  else
      echo "--> Minikube is already running."
  fi

  echo "--> Creating namespace '${NAMESPACE}' if it doesn't exist..."
  kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

  echo "--> Setting Docker environment to Minikube's daemon..."
  eval $(minikube -p minikube docker-env)
  echo "--> Docker environment is now pointing to Minikube."

  echo "--> Building application Docker images using the Makefile..."
  make build-collector build-processor build-service build-demo
  echo "--> Docker images built successfully inside Minikube."

  echo "--> Fetching Minikube IP and exporting for Kafka..."
  export MINIKUBE_IP=$(minikube ip)
  echo "   -> MINIKUBE_IP = ${MINIKUBE_IP}"

  echo "--> Applying 01-platform.yaml with envsubst..."
  envsubst < "${KUBE_DIR}/01-platform.yaml" | kubectl apply -f - -n "${NAMESPACE}"

  echo "--> Applying remaining manifests..."
  echo "--> Applying 02-app-services.yaml..."
  kubectl apply -f "${KUBE_DIR}/02-app-services.yaml" -n "${NAMESPACE}"
  echo "--> Applying 03-frontend.yaml..."
  kubectl apply -f "${KUBE_DIR}/03-frontend.yaml" -n "${NAMESPACE}"

  wait_for_resources

  echo ""
  echo "✅ Deployment to Minikube is complete!"
  echo ""
  echo "🌐 Access Instructions:"
  echo "--------------------------------------------------------------------------"
  echo "Frontend App:  minikube service frontend -n ${NAMESPACE}"
  echo "Adminer Tool:  minikube service adminer -n ${NAMESPACE}"
  echo "Events API:    minikube service events-api -n ${NAMESPACE} --url"
  echo "--------------------------------------------------------------------------"
  echo ""
}


# ------------- MAIN EXECUTION -------------
case "$1" in
  clean)
    clean_minikube
    ;;
  deploy)
    deploy_stack
    ;;
  *)
    echo "Usage: $0 {clean|deploy}"
    exit 1
    ;;
esac
