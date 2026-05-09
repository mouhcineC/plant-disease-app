from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from app.services.predictor import predict_disease

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    result = await predict_disease(file)

    if result["confidence"] < 0.75:
        return JSONResponse(content={
            "status":  "error",
            "code":    "LOW_CONFIDENCE",
            "message": "I'm not sure what plant disease this is. Please upload a clearer image."
        })

    return result