# Setup Guide

> **OWNER: Sara (Documentation), Muditha (DevOps)**
>
> TODO (Sara): Expand each section with detailed step-by-step instructions.
> TODO (Muditha): Verify all commands work on a fresh clone.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone <repo-url>
cd banking-system

# 2. Copy environment file
cp .env.example .env

# 3. Configure SMTP (for OTP emails)
# Option A: Use Ethereal (recommended for dev)
#   Go to https://ethereal.email/, create account, update .env
# Option B: Just read OTP from service logs (it's printed to console)

# 4. Start all services
docker-compose up --build

# 5. Access the application
# Frontend: http://localhost:5173
# Gateway:  http://localhost:3000
# Auth:     http://localhost:3001
# Account:  http://localhost:3002
# Notify:   http://localhost:3003
```

## Development (Without Docker)

<!-- TODO (Sara): Document how to run each service individually -->
<!-- Each service needs: npm install, npx prisma generate, npx prisma migrate dev, npm run dev -->

### Running Individual Services

```bash
# 1. Start PostgreSQL (local or Docker)
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine

# 2. Create databases
psql -U postgres -f init-databases.sql

# 3. Run each service (in separate terminals)
cd services/auth-service && npm install && npx prisma migrate dev && npm run dev
cd services/account-service && npm install && npx prisma migrate dev && npm run dev
cd services/notification-service && npm install && npx prisma migrate dev && npm run dev
cd gateway && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Database Migrations

<!-- TODO (Sara): Document migration commands per service (coordinate with Kasunara) -->

## Troubleshooting

<!-- TODO (Sara): Add common issues and solutions -->
