import json
import os
import sys
import time

import psycopg2
from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable
from psycopg2 import OperationalError


def get_db_connection():
    """Establishes a connection to the PostgreSQL database with retry logic."""
    max_attempts = int(os.environ.get("DB_CONNECT_MAX_ATTEMPTS", "60"))
    backoff_seconds = float(os.environ.get("DB_CONNECT_BACKOFF_SEC", "2.0"))
    attempt = 0
    while True:
        attempt += 1
        try:
            conn = psycopg2.connect(
                dbname=os.environ.get("POSTGRES_DB", "tracking_db"),
                user=os.environ.get("POSTGRES_USER", "user"),
                password=os.environ.get("POSTGRES_PASSWORD", "password"),
                host=os.environ.get("POSTGRES_HOST", "postgres"),
                port=os.environ.get("POSTGRES_PORT", "5432"),
            )
            print("Successfully connected to PostgreSQL.", flush=True)
            return conn
        except OperationalError as e:
            if attempt >= max_attempts:
                print(
                    f"Failed to connect to PostgreSQL after {attempt} attempts: {e}",
                    file=sys.stderr,
                    flush=True,
                )
                sys.exit(1)
            print(
                f"PostgreSQL not ready yet (attempt {attempt}/{max_attempts}). Retrying in {backoff_seconds}s...",
                file=sys.stderr,
                flush=True,
            )
            time.sleep(backoff_seconds)


def create_table(conn):
    """Creates the user_events table if it doesn't exist."""
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS user_events (
                event_id UUID PRIMARY KEY,
                event_type VARCHAR(50) NOT NULL,
                location_type VARCHAR(50),
                component_name VARCHAR(100),
                page_path VARCHAR(255),
                page_title VARCHAR(255),
                timestamp TIMESTAMPTZ NOT NULL,
                user_metadata JSONB,
                full_event_data JSONB,
                received_at TIMESTAMPTZ DEFAULT NOW()
            );
        """
        )
        conn.commit()
        print("Table 'user_events' is ready.", flush=True)


def main() -> None:
    """Main function to consume from Kafka and write to PostgreSQL."""
    bootstrap_servers = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
    topic = os.environ.get("KAFKA_TOPIC", "user-tracking-events")
    group_id = os.environ.get("GROUP_ID", "tracking-processor")

    # Connect to PostgreSQL
    conn = get_db_connection()
    create_table(conn)

    # Connect to Kafka
    consumer = KafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers,
        group_id=group_id,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        reconnect_backoff_ms=2000,
        retry_backoff_ms=500,
    )

    print(f"Consumer connected to Kafka, topic '{topic}'", flush=True)
    try:
        with conn.cursor() as cur:
            for message in consumer:
                event = message.value
                print(f"Processing event: {event.get('event_id')}", flush=True)
                cur.execute(
                    """
                    INSERT INTO user_events (
                        event_id, event_type, location_type, component_name,
                        page_path, page_title, timestamp, user_metadata, full_event_data
                    ) VALUES (%s, %s, %s, %s, %s, %s, to_timestamp(%s / 1000.0), %s, %s)
                    ON CONFLICT (event_id) DO NOTHING;
                    """,
                    (
                        event.get("event_id"),
                        event.get("event_type"),
                        event.get("location_type"),
                        event.get("component_name"),
                        event.get("page_path"),
                        event.get("page_title"),
                        event.get("timestamp"),
                        json.dumps(event.get("user_metadata", {})),
                        json.dumps(event),
                    ),
                )
                conn.commit()
                print(f"Successfully saved event: {event.get('event_id')}", flush=True)
    except KeyboardInterrupt:
        print("Processor interrupted, exiting...", file=sys.stderr)
    finally:
        consumer.close()
        conn.close()


if __name__ == "__main__":
    main()
