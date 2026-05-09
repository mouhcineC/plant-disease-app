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
  "plant": "Tomato",
  "disease": "Early Blight",
  "confidence": 0.94
}
```

### `GET /api/scan/history`

Return scan history (latest first).

Response (200):

```json
[
  {
    "imageUrl": "https://...",
    "plant": "Tomato",
    "disease": "Early Blight",
    "confidence": 0.94,
    "createdAt": "2026-04-28T10:32:14.123"
  }
]
```

## Error Notes

- `401 Unauthorized` when the JWT is missing or invalid.
- `400 Bad Request` with `"User not found"` when the token email does not exist in the DB.
