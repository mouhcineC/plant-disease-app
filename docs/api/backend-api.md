# Backend API

Base URL (local): `http://localhost:8080`

## Authentication Endpoints

### `POST /api/auth/register`

Create a new user.

Request body:

```json
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "StrongPass123"
}
```

Response (200):

```json
{
  "token": "<jwt_token>",
  "message": "User registered successfully"
}
```

### `POST /api/auth/login`

Authenticate existing user.

Request body:

```json
{
  "email": "user1@example.com",
  "password": "StrongPass123"
}
```

Response (200):

```json
{
  "token": "<jwt_token>",
  "message": "User logged in successfully"
}
```

## Scan Endpoints (JWT required)

Use the header:

```
Authorization: Bearer <jwt_token>
```

### `POST /api/scan`

Upload a leaf image (multipart form).

Form data:
- `file`: image file

Response (200):

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

### `GET /api/scan/history`

Return scan history (latest first).

Response (200):

```json
[
  {
    "id": 12,
    "imageUrl": "https://...",
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
    "topPredictions": [
      { "disease": "Early Blight", "confidence": 0.94 },
      { "disease": "Late Blight", "confidence": 0.03 }
    ],
    "createdAt": "2026-04-28T10:32:14.123"
  }
]
```

### `DELETE /api/scan/{id}`

Delete a scan from history (also removes the prediction record).

Response (204):

```
(no content)
```

## Error Notes

- `401 Unauthorized` when the JWT is missing or invalid.
- `400 Bad Request` when the user or scan does not exist.
- AI low-confidence responses return `status: "error"` with a message from the AI service.
