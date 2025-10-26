# Real-Time User Event Tracking and Analytics Platform

Scalable Services Assignment 1

## Project Details

This project implements a comprehensive real-time data streaming pipeline. The system demonstrates end-to-end event processing where user interactions on a web application are captured, sent to a data stream, processed in real-time, and stored in a database for analytics.

The architecture showcases modern streaming data processing patterns, containerization with Docker, and resilient service integration. The implementation serves as a foundation for understanding distributed streaming systems and can be extended for production-scale data processing scenarios.

### Custom Tracking Hook: `react-user-tracker`

A key component of this project is the custom-built React hook, **`react-user-tracker`**, which is responsible for capturing frontend events. It is designed for performance and scalability by batching events and sending them asynchronously to the backend collector.

This package has been published to the public npm registry and can be used in other projects.

- **NPM Package**: react-user-tracker
- **Version**: 0.1.2

### Authors

- Balaji O M
- Balasubramaniyan
- Deep Pokala
- Jagriti Sharma

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Is it Scalable?](#is-it-scalable)
- [Core Technologies](#core-technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running the Application](#running-the-application)
- [How to Use the System](#how-to-use-the-system)
  - [1. Generate User Events](#1-generate-user-events)
  - [2. View Data in the Database](#2-view-data-in-the-database)
  - [3. Inspect Kafka Topics (Optional)](#3-inspect-kafka-topics-optional)
- [Makefile Commands](#makefile-commands)

## Architecture Overview

The system is designed as a multi-stage pipeline that captures user events from a web frontend and processes them in real-time, ultimately storing them in a database for analytics.

```mermaid
graph TD
    subgraph "Browser"
        A[React Frontend App <br> (localhost:3000)]
    end

    subgraph "Data Ingestion"
        B[Event Collector <br> (Python/FastAPI)]
    end

    subgraph "Streaming Platform"
        C[Apache Kafka <br> (Topic: user-tracking-events)]
        D[Zookeeper]
    end

    subgraph "Data Processing & Storage"
        E[Event Processor <br> (Python Consumer)]
        F[PostgreSQL Database <br> (Table: user_events)]
    end

    subgraph "Developer Tooling"
        G[Adminer <br> (localhost:8080)]
    end

    A -- "1. User interaction (click, hover)" --> A
    A -- "2. Batched HTTP POST events" --> B
    B -- "3. Produces event messages" --> C
    C -- "Manages Kafka Cluster" --> D
    E -- "4. Consumes event messages" --> C
    E -- "5. Inserts processed data" --> F
    G -- "Inspects Database" --> F
```

**Data Flow:**

1.  **Event Generation**: A user interacts with the **React Frontend App**. A custom tracking script (`EventTracker`) batches these events (e.g., clicks, hovers).
2.  **Ingestion**: The batched events are sent via an HTTP POST request to the **Event Collector** service.
3.  **Streaming**: The Event Collector acts as a Kafka producer, publishing the events into the `user-tracking-events` topic in **Apache Kafka**.
4.  **Processing**: The **Event Processor**, a Python-based Kafka consumer, subscribes to the topic, reads the events in real-time, validates them, and prepares them for storage.
5.  **Storage**: The processor inserts the structured event data into the `user_events` table in the **PostgreSQL** database.
6.  **Inspection**: Developers can use **Adminer** to connect to the database and query the stored events.

## Is it Scalable?

Yes, the architecture is designed for scalability and resilience:

- **Stateless Services**: The `real-time-events-collector` and `real-time-events-processor` are stateless. You can run multiple instances of each to handle increased load.
- **Kafka as a Buffer**: Kafka acts as a durable, distributed buffer. It decouples the ingestion layer from the processing layer, allowing the system to handle spikes in traffic without losing data.
- **Parallel Processing**: By running multiple instances of the `real-time-events-processor` with the same `group_id`, Kafka will automatically distribute the topic partitions among them. This enables parallel consumption and processing of events, significantly increasing throughput.
- **Containerization**: All services are containerized with Docker, making it easy to deploy, manage, and scale them independently across different environments.

## Core Technologies

- **Frontend**: React (Next.js)
- **Backend Services**: Python
- **Message Broker**: Apache Kafka & Zookeeper
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Orchestration/Build**: `make`

## Getting Started

Follow these instructions to get the entire platform running on your local machine.

### Prerequisites

- Docker
- Docker Compose (usually included with Docker Desktop)
- `make` (available on macOS and Linux, or via Chocolatey on Windows)

### Running the Application

All commands should be run from the project's root directory.

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone <your-repo-url>
    cd scalable-services-assignment-1
    ```

2.  **Deploy the entire stack**:
    This single command will clean up any old containers/volumes, build fresh images for your services, and start everything in the correct order.
    ```bash
    make deploy
    ```

The first time you run this, it may take a few minutes to download the base Docker images and build your services. Subsequent runs will be much faster.

## How to Use the System

Once `make deploy` is complete, all services are running and ready for use.

### 1. Generate User Events

- Open your web browser and navigate to the frontend application: **http://localhost:3000**.
- Click around the UI, navigate to the "Authors" page, and hover over different elements. Each interaction is an event that is being sent through the pipeline.

### 2. View Data in the Database

- Open a new browser tab and navigate to Adminer: **http://localhost:8080**.
- Log in with the following credentials:
  - **System**: `PostgreSQL`
  - **Server**: `postgres`
  - **Username**: `user`
  - **Password**: `password`
  - **Database**: `tracking_db`
- Once logged in, click on the `user_events` table on the left. You will see the raw event data that was generated by your interactions on the website.

### 3. Inspect Kafka Topics (Optional)

You can use the `make` command to shell into the Kafka container and use its built-in tools.

- **List all topics**:
  ```bash
  docker exec -it kafka kafka-topics.sh --bootstrap-server localhost:9092 --list
  ```
- **Watch messages in the `user-tracking-events` topic**:
  ```bash
  docker exec -it kafka kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic user-tracking-events --from-beginning
  ```

## Makefile Commands

The `Makefile` provides convenient shortcuts for managing the Docker environment.

| Command                    | Description                                                                      |
| :------------------------- | :------------------------------------------------------------------------------- |
| `make deploy`              | **(Recommended)** Cleans the environment and deploys all services from scratch.  |
| `make up`                  | Builds and starts all services without cleaning first.                           |
| `make down`                | Stops and removes all containers and networks.                                   |
| `make clean`               | Stops and removes containers, networks, **and volumes** (all data will be lost). |
| `make logs`                | Tails the logs from all running services.                                        |
| `make ps`                  | Shows the status of all running containers.                                      |
| `make user-tracking-topic` | Manually creates the `user-tracking-events` Kafka topic.                         |
