import json
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from kafka import KafkaProducer

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

KAFKA_BROKER_URL = os.environ.get("KAFKA_BROKER_URL", "kafka:9092")
TOPIC_NAME = os.environ.get("TOPIC_NAME", "user-tracking-events")

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER_URL,
    value_serializer=lambda x: json.dumps(x).encode("utf-8"),
)


@app.route("/track", methods=["POST"])
def track_event():
    print("--- New track request ---")
    data = request.get_json()
    print("Received payload:", json.dumps(data, indent=2))
    if not data or "events" not in data:
        print("Invalid payload received!")
        response = jsonify({"error": "Invalid payload"})
        response.status_code = 400
        print(f"Sending response: {response.status_code}")
        return response

    for event in data["events"]:
        print(f"Sending event to Kafka: {event}")
        producer.send(TOPIC_NAME, value=event)

    producer.flush()
    print("All events sent and flushed to Kafka.")
    response = jsonify({"status": "ok"})
    response.status_code = 200
    print(f"Sending response: {response.status_code}")
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
