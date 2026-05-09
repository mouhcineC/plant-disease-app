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

## Prediction Endpoint (required by backend)

### `POST /predict`

Expected by the backend `AIClient`.

Form data:
- `file`: image file

Expected response:

```json
{
  "plant": "Tomato",
  "disease": "Early Blight",
  "confidence": 0.94
}
```

This endpoint is implemented in `ai-service/app/routes/prediction.py` and is mounted by `ai-service/app/main.py`.
