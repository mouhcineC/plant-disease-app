# AI Service API

Base URL (local): `http://localhost:8000`

## Health Endpoint

### `GET /health`

Health check endpoint used by Docker Compose.

Response (200):

```json
{
  "status": "ok"
}
```

## Prediction Endpoint (used by backend)

### `POST /api/predict`

Form data:
- `file`: image file

Success response (200):

```json
{
  "status": "success",
  "plant": "Tomato",
  "disease": "Early Blight",
  "confidence": 0.94,
  "severity": "moderate",
  "explanation": "Your tomato plant shows signs of Early Blight.",
  "solutions": {
    "chemical": "Apply copper-based fungicide every 7-10 days",
    "organic": "Neem oil spray, remove infected leaves",
    "prevention": "Avoid overhead watering, ensure good airflow"
  },
  "top_predictions": [
    { "disease": "Early Blight", "confidence": 0.94 },
    { "disease": "Late Blight", "confidence": 0.03 }
  ]
}
```

Low-confidence response (200):

```json
{
  "status": "error",
  "code": "LOW_CONFIDENCE",
  "message": "I'm not sure what plant disease this is. Please upload a clearer image."
}
```

Notes:
- The backend calls `/api/predict` based on the configured AI service base URL.
- This endpoint is implemented in `ai-service/app/routes/prediction.py` and mounted by `ai-service/app/main.py`.
