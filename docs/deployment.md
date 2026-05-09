# Deployment Notes

## Local deployment (current)

The project is deployed locally using Docker Compose.

```powershell
docker compose up --build -d
```

Services:
- `frontend` -> port `3000`
- `backend` -> port `8080`
- `ai-service` -> port `8000`
- `mysql` -> host port `3307`, container port `3306`

## Recommended production direction

1. Use managed database (or secured MySQL with backups).
2. Store secrets in environment/secret manager (not in source).
3. Add reverse proxy (Nginx/Traefik) and HTTPS.
4. Configure monitoring and centralized logs.
5. Add CI/CD pipeline for build, test, and deployment.

## Minimum production checklist

- [ ] Strong `JWT_SECRET`
- [ ] Secure DB credentials
- [ ] Secure Cloudinary credentials
- [ ] `VITE_API_BASE_URL` points to `/api`
- [ ] HTTPS enabled
- [ ] CORS restricted to trusted domains
- [ ] Health checks monitored
- [ ] Backups and restore strategy tested

