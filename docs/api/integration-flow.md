# Integration Flow

## Current flow

1. Frontend authenticates with backend and stores JWT.
2. Frontend uploads a plant image to backend using `multipart/form-data`.
3. Backend uploads the image to Cloudinary and calls AI service `/api/predict`.
4. AI service returns prediction details (severity, explanations, solutions, top predictions).
5. Backend persists scan + prediction and returns the AI response to frontend.
6. Frontend renders prediction and saves history.

## History and deletion

1. Frontend fetches history from `GET /api/scan/history`.
2. Backend returns AI fields (severity, explanation, solutions, top predictions) per scan.
3. Frontend can delete scans via `DELETE /api/scan/{id}`.

## Integration considerations

- Add timeout/retry policy for backend-to-AI calls.
- Standardize error format between services.
- Track model version in prediction response for traceability.
