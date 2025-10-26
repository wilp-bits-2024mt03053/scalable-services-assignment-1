# Project Setup Instructions

This document provides instructions on how to set up and run this project in both development and production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup (Docker Compose)](#development-setup-docker-compose)
- [Production Setup (Kubernetes with Minikube)](#production-setup-kubernetes-with-minikube)
- [Accessing the Application](#accessing-the-application)
- [Formatting the Code](#formatting-the-code)

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

- **Docker**: [Installation Guide](https://docs.docker.com/get-docker/)
- **Docker Compose**: (Usually included with Docker Desktop) [Installation Guide](https://docs.docker.com/compose/install/)
- **Minikube**: (For production setup) [Installation Guide](https://minikube.sigs.k8s.io/docs/start/)
- **kubectl**: (For production setup) [Installation Guide](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- **make**: (Available on macOS and Linux, or via Chocolatey on Windows)
- **Node.js and npm**: (For frontend development) [Installation Guide](https://nodejs.org/)

## Development Setup (Docker Compose)

For local development, you can use Docker Compose to run the entire application stack.

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd scalable-services-assignment-1
    ```

2.  **Deploy the stack**:
    This command will build the Docker images and start all the services.
    ```bash
    make deploy
    ```

## Production Setup (Kubernetes with Minikube)

For a production-like environment, you can deploy the application to a local Kubernetes cluster using Minikube.

1.  **Start the deployment script**:
    ```bash
    ./deploy-minikube.sh
    ```
    This script will:
    - Start Minikube if it's not already running.
    - Create the `scalable-services` namespace.
    - Build the Docker images inside Minikube.
    - Deploy all the necessary Kubernetes resources to the `scalable-services` namespace.

## Accessing the Application

### Development (Docker Compose)

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Adminer (Database Tool)**: [http://localhost:8080](http://localhost:8080)
- **Events API**: [http://localhost:8001/events](http://localhost:8001/events)

### Production (Minikube)

- **Frontend Application**:
  ```bash
  minikube service frontend -n scalable-services
  ```
- **Adminer (Database Tool)**:
  ```bash
  minikube service adminer -n scalable-services
  ```
- **Events API**:
  ```bash
  minikube service events-api -n scalable-services --url
  ```

## Formatting the Code

This project uses Prettier for the frontend and Black/isort for the Python services. A shell script is provided to format the entire project.

- **Run the formatter**:
  ```bash
  ./formatter.sh
  ```