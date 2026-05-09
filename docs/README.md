# Documentation

This folder contains technical and project documentation for the Plant Disease Detection Web Application.

## Quick Navigation

- `setup.md`: local setup, run commands, and environment variables.
- `architecture.md`: system architecture, service responsibilities, and request flow.
- `troubleshooting.md`: common local and Docker issues with quick fixes.
- `api/`: backend and AI service API documentation.
- `deployment.md`: deployment notes for local, staging, and production-like environments.
- `roadmap.md`: implementation phases and milestone checklist.
- `demo-script.md`: suggested PFE demo flow.

## Supporting Folders

- `uml/`: use case, class, and sequence diagrams.
- `diagrams/`: architecture and deployment diagrams.
- `notes/`: meeting notes, research notes, and references.

## Current Stack Snapshot

- `frontend/`: React + Vite + Tailwind CSS
- `backend/`: Spring Boot + Spring Security + MySQL
- `ai-service/`: FastAPI + TensorFlow/Keras (health endpoint wired)
- Root orchestration: Docker Compose

## Documentation Status

- Setup, architecture, deployment, and troubleshooting docs are current.
- API docs cover auth, scan, history, and AI health endpoints.
- AI inference endpoint (`/predict`) is described but not implemented in the AI service yet.
- Diagram placeholders are ready for exported visuals from draw.io/StarUML/PlantUML.
