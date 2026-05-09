# Roadmap

## Phase 1 - Foundation (done)

- [x] Monorepo structure created
- [x] Frontend starter (React + Tailwind)
- [x] Backend starter (Spring Boot + MySQL + Security)
- [x] AI service starter (FastAPI)
- [x] Docker Compose for full stack
- [x] Auth register/login base flow

## Phase 2 - Core Disease Detection (done)

- [x] Add image upload endpoint in backend
- [x] Add inference endpoint in AI service
- [x] Backend integrates with AI service `/api/predict`
- [x] Return prediction result + confidence to frontend

## Phase 3 - Product Features (done/in progress)

- [x] User history of predictions
- [x] AI explanations, severity, and solutions persisted
- [x] Scan delete endpoint and UI
- [x] Improved frontend UX and guidance

## Phase 4 - Quality and Delivery (next)

- [ ] Unit/integration tests per service
- [ ] DB migrations (Flyway or Liquibase)
- [ ] API documentation polish + examples
- [ ] Security hardening (roles, token rotation)
- [ ] Deployment pipeline + final PFE demo preparation
