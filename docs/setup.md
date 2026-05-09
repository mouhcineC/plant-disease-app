# Setup Guide

This guide explains how to run the project locally and with Docker Compose.

## 1) Prerequisites

- Git
- Docker Desktop + Docker Compose plugin
- (Optional for non-Docker local runs)
  - Node.js 20+
  - Java 17
  - Maven 3.9+
  - Python 3.11
  - MySQL 8

## 2) Clone and prepare

```powershell
git clone https://github.com/Louazri/plant-disease-app.git
cd plant-disease-app
```

Create a local environment file from `.env.example`.

```powershell
Copy-Item .env.example .env
```

## 3) Run with Docker (recommended)

```powershell
docker compose up --build
```

Expected ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- AI service: `http://localhost:8000`
- MySQL (host): `3307` (container still uses `3306`)

Stop services:

```powershell
docker compose down
```

Reset volumes (if needed):

```powershell
docker compose down -v
```

## 4) Run modules without Docker (optional)

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Backend

```powershell
cd backend
mvn spring-boot:run
```

### AI Service

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 5) Environment Variables (main)

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION_MS`
- `AI_SERVICE_PORT`, `AI_SERVICE_URL`
- `VITE_API_BASE_URL` (should include `/api`, e.g. `http://localhost:8080/api`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

See `.env.example` for defaults.
