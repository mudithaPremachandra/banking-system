# Data Dictionary

> **OWNER: Sara (Documentation), Kasunara (DBA)**
>
> TODO (Sara): Complete field descriptions and constraints for all tables.
> TODO (Kasunara): Review and validate all data types and constraints.

## Database Architecture

The system uses a **single PostgreSQL instance** with **three separate databases**:

| Database | Service | Schema File |
|----------|---------|-------------|
| auth_db | Auth Service | `services/auth-service/prisma/schema.prisma` |
| account_db | Account Service | `services/account-service/prisma/schema.prisma` |
| notification_db | Notification Service | `services/notification-service/prisma/schema.prisma` |

---

## auth_db

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Unique user identifier |
| email | VARCHAR | UNIQUE, NOT NULL | User's email address |
| phone | VARCHAR | NULLABLE | Optional phone number |
| passwordHash | VARCHAR | NOT NULL | bcrypt hash of password |
| fullName | VARCHAR | NOT NULL | User's display name |
| createdAt | TIMESTAMP | NOT NULL, default now() | Account creation time |
| updatedAt | TIMESTAMP | NOT NULL, auto-updated | Last modification time |

### Tokens Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, auto-generated | Token record identifier |
| userId | UUID | FK → Users.id | Owner of this token |
| refreshToken | VARCHAR | UNIQUE, NOT NULL | JWT refresh token string |
| expiresAt | TIMESTAMP | NOT NULL | When this token expires |
| revoked | BOOLEAN | NOT NULL, default false | Whether token has been revoked |
| createdAt | TIMESTAMP | NOT NULL, default now() | When token was issued |

---

## account_db

### Accounts Table

<!-- TODO (Sara): Complete with Disaan and Kasunara -->

### Transactions Table

<!-- TODO (Sara): Complete with Disaan and Kasunara -->

---

## notification_db

### OTPs Table

<!-- TODO (Sara): Complete with Geethika and Kasunara -->
