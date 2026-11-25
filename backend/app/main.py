from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .database import engine, Base
from . import models, routes

# Load environment variables (including the API key)
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EDGE Sports Intelligence",
    description="College Football Analytics & Paper Trading Backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API routes
app.include_router(routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "EDGE Sports Intelligence backend is running",
        "mode": "paper_trading_only",
        "sport": "college_football",
        "data": "real",
        "database": "connected"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
