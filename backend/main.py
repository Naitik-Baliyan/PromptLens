from dotenv import load_dotenv
load_dotenv()  # Load .env file

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PromptLens API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from database.database import engine, Base
from database import models
from routes import diff, autopsy, mutate, score, dataset

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(diff.router)
app.include_router(autopsy.router)
app.include_router(mutate.router)
app.include_router(score.router)
app.include_router(dataset.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PromptLens API is running"}
