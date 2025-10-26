
import json
import os
from flask import Flask, jsonify, request
from kafka import KafkaProducer
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

KAFKA_BROKER_URL = os.environ.get('KAFKA_BROKER_URL', 'kafka:9092')
TOPIC_NAME = os.environ.get('TOPIC_NAME', 'user-tracking-events')

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER_URL,
    value_serializer=lambda x: json.dumps(x).encode('utf-8'),
)


@app.route('/track', methods=['POST'])
def track_event():
    data = request.get_json()
    print("Received payload:", data)
    if not data or 'events' not in data:
        print("Invalid payload received!")
        return jsonify({'error': 'Invalid payload'}), 400

    for event in data['events']:
        print(f"Sending event to Kafka: {event}")
        producer.send(TOPIC_NAME, value=event)

    producer.flush()
    print("All events sent and flushed to Kafka.")
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
