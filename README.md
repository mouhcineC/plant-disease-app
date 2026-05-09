# Plant Disease Detection Web Application

Monorepo for a PFE project: plant disease detection with a React frontend, Spring Boot API, and FastAPI AI service.

## Stack
- `frontend/`: React + Vite + Tailwind CSS
- `backend/`: Spring Boot + Spring Security + JWT + MySQL
- `ai-service/`: FastAPI (health endpoint; prediction endpoint required by backend)
- `docs/`: architecture, setup, API docs, troubleshooting, roadmap

## Quick Structure
- `frontend/src/`
- `backend/src/main/java/com/plantdisease/`
- `backend/src/main/resources/`
- `ai-service/app/`
- `docs/uml/`, `docs/diagrams/`, `docs/notes/`

## Run everything with Docker

Each service now has its own container definition and the root `docker-compose.yml` starts the full stack:

- `frontend` on http://localhost:3000
- `backend` on http://localhost:8080
- `ai-service` on http://localhost:8000
- `mysql` on port 3306



