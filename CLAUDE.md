# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Docker (recommended for full-stack development)
```bash
docker-compose up --build       # Build and start all services
docker-compose up -d            # Start in detached mode
docker-compose down             # Stop all services
docker-compose down -v          # Stop and wipe all data (removes volumes)
docker-compose logs <service>   # View logs for a specific service
```

### Running a single service locally
```bash
cd <service-dir> && npm install && npm run dev
```
Replace `<service-dir>` with `frontend`, `gateway`, `services/auth-service`, `services/account-service`, or `services/notification-service`.

### Database migrations (per service)
```bash
cd services/<service> && npx prisma migrate dev      # Apply migrations
cd services/<service> && npx prisma generate         # Regenerate Prisma client
cd services/<service> && npx prisma studio           # Open Prisma GUI
```

### Tests
```bash
cd <service-dir> && npm test                         # Run all tests
cd <service-dir> && npx jest <path/to/test.file>     # Run a single test file
```

### Frontend
```bash
cd frontend && npm run dev      # Dev server (port 5173)
cd frontend && npm run build    # TypeScript + Vite production build
```

## Architecture Overview

This is a **microservices banking system** with a React SPA, API Gateway, three backend services, and a single PostgreSQL instance with three separate databases.

### Services and Ports

| Service | Port | Owner | Directory |
|---------|------|-------|-----------|
| Frontend (React + Vite) | 5173 | Muditha / Kasun | `frontend/` |
| API Gateway (Express) | 3000 | Sanjaya | `gateway/` |
| Auth Service | 3001 | Sandun | `services/auth-service/` |
| Account Service | 3002 | Disaan | `services/account-service/` |
| Notification Service | 3003 | Geethika | `services/notification-service/` |
| PostgreSQL | 5432 | Kasunara | `init-databases.sql` |

### Request Flow

```
Browser → Frontend (Vite proxy /api → :3000) → API Gateway → Backend Services → PostgreSQL
```

The **API Gateway** is the single entry point. It validates JWTs by calling `GET /auth/verify-token` on the Auth Service before proxying protected routes, then forwards `x-user-id` in the request header to downstream services.

The **Frontend Vite dev proxy** maps `/api` to `http://localhost:3000`, so the frontend never calls backend services directly.

### Databases

Single PostgreSQL instance with three separate databases, each owned by its service:
- `auth_db` — Users, password hashes, refresh tokens
- `account_db` — Bank accounts, balances, transaction history (DEPOSIT/WITHDRAWAL enum)
- `notification_db` — OTP records (bcrypt-hashed, 5-minute expiry)

Each service has its own `prisma/schema.prisma` and `DATABASE_URL` environment variable.

### Inter-Service Communication

- **Gateway → Auth Service**: `GET /auth/verify-token` (JWT pre-verification)
- **Auth Service → Notification Service**: `POST /otp/send` (trigger OTP after login/register)
- Services communicate over the internal Docker network `banking-net` using hostnames (e.g., `http://auth-service:3001`)

### Backend Service Structure (consistent across all three services)

```
src/
├── app.ts              # Express setup, middleware, health check at GET /health
├── routes/             # Route handlers (thin layer)
├── services/           # Business logic
├── repositories/       # Prisma database access
├── middleware/         # requireAuth.ts, errorHandler.ts, zodValidation.ts
├── lib/                # Shared utilities (Prisma client instance)
├── config/             # Service-specific config (e.g., SMTP/mailer)
└── __tests__/          # Jest + supertest tests
```

### Authentication Flow

1. Register/Login → Auth Service creates user/verifies password → triggers OTP email via Notification Service
2. OTP verify → Notification Service checks 6-digit code (5-min expiry, bcrypt-hashed in DB)
3. Authenticated requests → Gateway calls `GET /auth/verify-token` → forwards `x-user-id` header to downstream service
4. Token refresh → `POST /api/auth/refresh` exchanges refresh token for new access token
5. Logout → `POST /api/auth/logout` revokes refresh token in `auth_db`

## Environment Setup

Copy `.env.example` to `.env` before running. The `.env` file must define:
- PostgreSQL credentials and three `DATABASE_URL` values
- `JWT_SECRET`, `ACCESS_TOKEN_EXPIRY`, `REFRESH_TOKEN_EXPIRY`
- SMTP credentials for the Notification Service (can be skipped; OTP will log to console)
- Internal service URLs (used inside Docker, e.g., `AUTH_SERVICE_URL=http://auth-service:3001`)

## Key Technology Choices

- **TypeScript** throughout — all services and frontend
- **Prisma 5.7** for ORM and migrations (type-safe, per-service schemas)
- **Zod 3.22** for runtime request validation at the Gateway and service level
- **JWT** (jsonwebtoken) for access tokens + bcryptjs for passwords and OTP hashing
- **Jest + supertest** for backend testing; `ts-jest` for TypeScript support
- **ts-node-dev** for hot-reload during local development

## Project Status

The project is in **initial scaffold** phase. Most service implementations are incomplete — route handlers, middleware registration, and business logic are stubs with TODO comments. Refer to the `docs/` directory for planned API contracts before implementing endpoints.
