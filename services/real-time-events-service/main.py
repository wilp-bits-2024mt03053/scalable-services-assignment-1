import os
from typing import List, Optional

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
def get_events(
    conn=Depends(get_db_connection),
    event_type: Optional[str] = None,
    location_type: Optional[str] = None,
    component_name: Optional[str] = None,
    page_path: Optional[str] = None,
    limit: int = 30,
):
    """
    Retrieves user events from the database, with optional filtering.
    Returns the last N matching records, ordered by the most recently received.
    """
    print(f"--- New events request ---")
    print(f"Parameters: event_type={event_type}, location_type={location_type}, component_name={component_name}, page_path={page_path}, limit={limit}")

    query = "SELECT * FROM user_events"
    conditions = []
    params = []

    if event_type:
        # If the request is for 'HOVER', fetch both enter and leave events.
        if event_type.upper() == "HOVER":
            conditions.append("event_type IN (%s, %s)")
            params.extend(["HOVER_ENTER", "HOVER_LEAVE"])
        else:
            conditions.append("event_type = %s")
            params.append(event_type)
    if location_type:
        conditions.append("location_type = %s")
        params.append(location_type)
    if component_name:
        conditions.append("component_name = %s")
        params.append(component_name)
    if page_path:
        conditions.append("page_path = %s")
        params.append(page_path)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " ORDER BY received_at DESC LIMIT %s;"

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(query, tuple(params) + (limit,))
        events = cur.fetchall()
    
    print(f"Returning {len(events)} events.")
    return events
