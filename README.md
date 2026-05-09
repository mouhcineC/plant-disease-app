# Plant Disease Detection Web Application

Monorepo for a PFE project: plant disease detection with a React frontend, Spring Boot API, and FastAPI AI service.

## Stack
- `frontend/`: React + Vite + Tailwind CSS
- `backend/`: Spring Boot + Spring Security + JWT + MySQL
- `ai-service/`: FastAPI + TensorFlow/Keras
- `docs/`: architecture, setup, API docs, troubleshooting, roadmap

## Key Features (current)
- JWT auth (register/login)
- Secure scan upload with `multipart/form-data`
- AI inference results including confidence, severity, explanations, and solutions
- Scan history with AI details, expand/collapse, and delete
- CORS configured for local frontend
- Docker Compose for full stack

## Quick Structure
- `frontend/src/`
- `backend/src/main/java/com/plantdisease/`
- `backend/src/main/resources/`
- `ai-service/app/`
- `docs/uml/`, `docs/diagrams/`, `docs/notes/`

## Run everything with Docker

Each service has its own container definition and the root `docker-compose.yml` starts the full stack:

- `frontend` on http://localhost:3000
- `backend` on http://localhost:8080
- `ai-service` on http://localhost:8000
- `mysql` on port 3306 (host port is 3307)

```powershell
Set-Location "D:\PFE\plant-disease-app"
docker compose up --build
```

Stop services:

```powershell
docker compose down
```

## Environment Notes
- `VITE_API_BASE_URL` should include `/api` (example: `http://localhost:8080/api`).
- CORS is configured for `http://localhost:3000`.
- JWT secrets and Cloudinary credentials are required for production-like runs.

## Next Steps
- Add automated tests per service (unit + integration).
- Add DB migration tooling (Flyway/Liquibase) for schema evolution.
- Add admin/analytics insights (aggregate history stats).
- Production hardening: HTTPS, strict CORS, monitoring, backups.
