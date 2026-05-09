# System Architecture

## Overview

The project uses a service-oriented monorepo with three runtime services:

1. **Frontend** (`frontend/`): React app (Vite build), served by Nginx in Docker.
2. **Backend** (`backend/`): Spring Boot API handling authentication and business logic.
3. **AI Service** (`ai-service/`): FastAPI service for ML inference and health endpoints.

Persistence is handled by **MySQL**.

## Responsibilities by Service

### Frontend (React + Tailwind)

- Renders UI and sends API requests to backend.
- Uses `VITE_API_BASE_URL` to target backend (should include `/api`).

### Backend (Spring Boot)

- Exposes auth endpoints under `/api/auth/**`.
- Exposes scan endpoints under `/api/scan` and `/api/scan/history`.
- Applies security rules (auth endpoints public; others protected).
- Integrates with AI service through `AI_SERVICE_URL` and expects `/predict`.

### AI Service (FastAPI)

- Exposes `/health` endpoint.
- Should expose `/predict` for disease inference (required by backend).

### Database (MySQL)

- Stores application data (users, scans, predictions).
- Backend connects via service name `mysql` inside Docker network.

## Runtime Communication Flow

1. User accesses frontend (`:3000`).
2. Frontend calls backend (`:8080/api`).
3. Backend reads/writes MySQL (`mysql:3306`).
4. Backend calls AI service (`ai-service:8000`) for inference operations.

## Deployment View (Docker Compose)

- Single Docker network created by Compose.
- Health checks:
  - MySQL health check gates backend startup.
  - AI service health check gates backend startup.
- Frontend depends on backend startup.

## Architectural Notes for PFE

- Auth, scan, and history flows are wired in the backend and frontend.
- AI inference endpoint remains to be implemented in the AI service.
- Add diagrams in `docs/diagrams/` and sequence diagrams in `docs/uml/` as implementation evolves.
