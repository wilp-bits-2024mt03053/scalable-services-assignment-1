import os
from typing import List

import psycopg2
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg2.extras import RealDictCursor

app = FastAPI(
    title="Real-Time Events Service",
    description="API to retrieve user tracking events from PostgreSQL.",
    version="1.0.0",
)

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def get_db_connection():
    """Establishes and yields a connection to the PostgreSQL database."""
    conn = None
    try:
        conn = psycopg2.connect(
            dbname=os.environ.get("POSTGRES_DB"),
            user=os.environ.get("POSTGRES_USER"),
            password=os.environ.get("POSTGRES_PASSWORD"),
            host=os.environ.get("POSTGRES_HOST"),
            port=os.environ.get("POSTGRES_PORT", "5432"),
        )
        yield conn
    except psycopg2.OperationalError as e:
        raise HTTPException(status_code=503, detail=f"Database connection error: {e}")
    finally:
        if conn:
            conn.close()


@app.get("/events", response_model=List[dict])
def get_all_events(conn=Depends(get_db_connection)):
    """
    Retrieves all user events from the database, ordered by the most recently received.
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM user_events ORDER BY received_at DESC;")
        events = cur.fetchall()
    return events