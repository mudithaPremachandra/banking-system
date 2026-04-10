# Banking System — Microservices Architecture

> **Project Lead:** Muditha | **Team Size:** 9 | **Stack:** TypeScript, Express, React, Prisma, PostgreSQL, Docker

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/mudithaPremachandra/banking-system.git && cd banking-system

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your values (especially SMTP credentials)

# 3. Start everything
docker-compose up --build

# 4. Run the frontend
Navigate to frontend/
npm run dev

# 5. Access the app
Frontend:  http://localhost:5173
Gateway:   http://localhost:3000
Auth API:  http://localhost:3001
Account:   http://localhost:3002
Notif:     http://localhost:3003
```

## Architecture

```
Frontend (5173) → API Gateway (3000) → Auth Service (3001)
                                     → Account Service (3002)
                                     → Notification Service (3003)
                                              ↓
                                     PostgreSQL (5432)
                                   ┌──────┼──────┐
                                auth_db  account_db  notification_db
```

## Team Responsibilities

| # | Member | Role | Service/Area |
|---|--------|------|-------------|
| 1 | Muditha | Project Lead / Frontend / DevOps | `frontend/`, `docker-compose.yml` |
| 2 | Kasun | UI/UX Designer / Frontend | Figma, `frontend/`, `frontend/src/pages/` |
| 3 | Sanjaya | API Gateway Developer | `gateway/` |
| 4 | Sandun | Auth Service Developer | `services/auth-service/` |
| 5 | Disaan | Account & Transaction Developer | `services/account-service/` |
| 6 | Kasunara | Database Administrator | `prisma/schema.prisma` (all 3) |
| 7 | Geethika | Notification Service Developer | `services/notification-service/` |
| 8 | Sara | Documentation | `docs/` |
| 9 | Kawindi | Testing | `__tests__/` directories |

## Documentation

- [API Reference](docs/api-reference.md)
- [Setup Guide](docs/setup-guide.md)
- [Data Dictionary](docs/data-dictionary.md)
- [Architecture](docs/architecture.md)
