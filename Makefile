
.PHONY: up down logs ps deploy clean build-collector build-processor build-service build-demo

deploy: clean
	@echo "--> Environment cleaned."
	@echo "--> Building and starting services..."
	@$(MAKE) up
	@echo "--> Waiting for Kafka to be ready..."
	@sleep 10
	@echo "--> Creating Kafka topic 'user-tracking-events'..."
	@$(MAKE) user-tracking-topic
	@echo "--> Deployment complete. Services are up and topic is created."

up:
	docker compose up -d --build

clean:
	@echo "--> Cleaning up existing containers, networks, and volumes..."
	@$(MAKE) down

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

ps:
	docker compose ps

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