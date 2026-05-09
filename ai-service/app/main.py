from fastapi import FastAPI
from app.routes.prediction import router
from app.models.plant_model import load_model
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield

app = FastAPI(
    title="Plant Disease AI Service",
    description="Detects plant diseases from images",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}

