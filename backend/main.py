from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.database import engine, Base
from backend.routes import auth, students, enquiries, attendance, fees, seats, notifications, admin

# Create tables in SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Keshav Library API",
    description="Backend API for Keshav Library study space and member management.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(enquiries.router)
app.include_router(attendance.router)
app.include_router(fees.router)
app.include_router(seats.router)
app.include_router(notifications.router)
app.include_router(admin.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "Keshav Library API", "version": "1.0.0"}

# Serve frontend static files if directory exists
if os.path.exists("frontend"):
    app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
