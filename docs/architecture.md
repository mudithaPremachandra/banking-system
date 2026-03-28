# Architecture Overview

> **OWNER: Sara (Documentation)**
>
> TODO (Sara): Add Mermaid diagrams, expand each section with details.

## System Architecture

```
┌─────────────┐
│   Frontend   │  React + Vite (port 5173)
│   (SPA)      │  Login, Register, Dashboard, Deposit, Withdraw, OTP
└──────┬───────┘
       │ HTTP (all requests go to /api/*)
       ▼
┌──────────────┐
│  API Gateway │  Express (port 3000)
│              │  Zod validation, JWT pre-check, request proxying
└──┬───┬───┬───┘
   │   │   │
   ▼   ▼   ▼
┌──────┐ ┌──────────┐ ┌──────────────┐
│ Auth │ │ Account  │ │ Notification │
│ 3001 │ │  3002    │ │    3003      │
└──┬───┘ └────┬─────┘ └──────┬───────┘
   │          │              │
   ▼          ▼              ▼
┌─────────────────────────────────────┐
│          PostgreSQL (5432)          │
│  auth_db  │  account_db  │ notif_db │
└─────────────────────────────────────┘
```

## Inter-Service Communication

| Caller | Target | Endpoint | Purpose |
|--------|--------|----------|---------|
| Auth Service | Notification Service | POST /otp/send | Trigger OTP email after login |
| API Gateway | Auth Service | GET /auth/verify-token | Validate JWT before proxying |

## Key Design Decisions

<!-- TODO (Sara): Document the following decisions and their rationale:
1. Why microservices (decomposed from monolith)
2. Why REST (no message queue)
3. Why database-per-service
4. Why JWT with access + refresh tokens
5. Why OTP via email (not SMS)
6. Why Prisma (type-safe ORM)
7. Why Docker Compose (not Kubernetes)
-->

## Authentication Flow

<!-- TODO (Sara): Document the full auth flow:
1. User registers → Auth Service creates user → OTP sent
2. User enters OTP → Notification Service verifies → tokens issued
3. User accesses protected route → Gateway checks JWT → proxies to service
4. Token expires → frontend refreshes → new access token
-->
