
.PHONY: up-dev down-dev logs-dev ps-dev up-prod down-prod logs-prod ps-prod deploy clean build-collector build-processor build-service build-demo

# --- Development Commands ---
up-dev:
	@echo "--> Starting development environment..."
	@docker compose -f docker-compose.dev.yml up -d --build

down-dev:
	@echo "--> Stopping development environment..."
	@docker compose -f docker-compose.dev.yml down -v

logs-dev:
	@docker compose -f docker-compose.dev.yml logs -f --tail=200

ps-dev:
	@docker compose -f docker-compose.dev.yml ps

# --- Production Commands ---
up-prod:
	@echo "--> Starting production environment..."
	@docker compose -f docker-compose.yml up -d

down-prod:
	@echo "--> Stopping production environment..."
	@docker compose -f docker-compose.yml down -v

logs-prod:
	@docker compose -f docker-compose.yml logs -f --tail=200

ps-prod:
	@docker compose -f docker-compose.yml ps

# --- Deployment ---
deploy: clean
	@echo "--> Environment cleaned."
	@echo "--> Building and starting services..."
	@$(MAKE) up-prod
	@echo "--> Waiting for Kafka to be ready..."
	@sleep 10
	@echo "--> Creating Kafka topic 'user-tracking-events'..."
	@$(MAKE) user-tracking-topic
	@echo "--> Deployment complete. Services are up and topic is created."

clean:
	@echo "--> Cleaning up existing containers, networks, and volumes..."
	@$(MAKE) down-prod

topic:
	docker exec -it kafka kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic events --replication-factor 1 --partitions 1 || true

user-tracking-topic:
	docker exec -it kafka kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic user-tracking-events --replication-factor 1 --partitions 1 || true

# --- Individual Image Builds for Kubernetes ---

build-collector:
	@echo "--> Building real-time-events-collector image..."
	@docker build -t real-time-events-collector:latest ./services/real-time-events-collector

build-processor:
	@echo "--> Building real-time-events-processor image..."
	@docker build -t real-time-events-processor:latest ./services/real-time-events-processor

build-service:
	@echo "--> Building real-time-events-service image..."
	@docker build -t real-time-events-service:latest ./services/real-time-events-service

build-demo:
	@echo "--> Building real-time-user-tracker-demo image..."
	@docker build -t real-time-user-tracker-demo:latest ./services/real-time-user-tracker-demo