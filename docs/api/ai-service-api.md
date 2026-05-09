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

Note: `/predict` is not implemented in `ai-service/app/main.py` yet, so `/api/scan` will fail until this endpoint is added.
