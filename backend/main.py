from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ai, graph, auth
from model import create_db_file

# import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    """Ensure app.db schema (including password_hash column) exists on boot."""
    create_db_file()

app.include_router(ai.router)
app.include_router(graph.router)
app.include_router(auth.router)