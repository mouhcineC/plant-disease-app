# Troubleshooting

## Docker issues

### 1) Only AI service starts; backend/frontend stay stopped

Cause:
- Most commonly MySQL fails first (port conflict or unhealthy), so backend cannot start.

Checks:

```powershell
docker compose ps -a
docker compose logs mysql backend ai-service frontend --tail=200
```

Fix:
- Ensure host MySQL port is free or use the configured alternate host port (`3307`).
- Restart cleanly:

```powershell
docker compose down -v
docker compose up --build
```

### 2) Port already in use

Symptom:
- Error like `bind: Only one usage of each socket address...`

Fix:
- Stop the process using that port or change host mapping in `docker-compose.yml`.

### 3) Backend container keeps restarting

Checks:

```powershell
docker compose logs backend --tail=200
docker compose logs mysql --tail=200
```

Typical causes:
- DB credentials mismatch.
- DB not healthy yet.
- Spring configuration errors.

## Backend auth issues

### 1) Login fails for valid user

- Confirm user exists in DB.
- Confirm password is stored encoded (`BCrypt`) and verified with `PasswordEncoder.matches(...)`.

### 2) 401 on endpoints

- In current config, `/api/auth/**` is public; others are protected.
- Ensure the frontend is sending `Authorization: Bearer <token>` on `/api/scan` and `/api/scan/history`.

## Frontend issues

### API calls target wrong backend URL

- `VITE_API_BASE_URL` should include `/api` (example: `http://localhost:8080/api`).
- Rebuild frontend image after changing env/build args:

```powershell
docker compose build --no-cache frontend
docker compose up -d frontend
```

### History shows "Unable to load history"

- Check browser Network tab for status code.
- `401` usually means missing/expired JWT.
- `400` with `"User not found"` means the token email does not exist in DB.

## Useful diagnostic commands

```powershell
docker compose config
docker compose ps -a
docker compose logs --tail=100
```
