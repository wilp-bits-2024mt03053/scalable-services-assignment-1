

.PHONY: up down logs ps deploy clean

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
