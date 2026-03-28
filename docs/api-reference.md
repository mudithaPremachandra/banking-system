# API Reference

> **OWNER: Sara (Documentation)**
> All endpoints are accessed through the API Gateway at `http://localhost:3000`.
> Protected routes require `Authorization: Bearer <accessToken>` header.

---

## Error Envelope (all services)

Every error response uses this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, login, deposit/withdrawal |
| 201 | Created | Successful registration |
| 400 | Bad Request | Zod validation failure, insufficient funds, invalid OTP |
| 401 | Unauthorized | Missing/invalid JWT, wrong password |
| 404 | Not Found | User or account not found |
| 409 | Conflict | Duplicate email on registration |
| 410 | Gone | OTP has expired |
| 500 | Server Error | Unexpected error |

---

## Auth Service — `/api/auth/*`

Proxied by Gateway → `http://auth-service:3001`

### POST /api/auth/register

Register a new user. Triggers an OTP email after account creation.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "minlength8",
  "fullName": "John Silva",
  "phone": "+94771234567"
}
```
> `phone` is optional.

**Success — 201:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Silva"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Errors:**
- `409` — `EMAIL_EXISTS` — Email already registered
- `400` — `VALIDATION_ERROR` — Missing or invalid fields

---

### POST /api/auth/login

Authenticate an existing user. Triggers OTP email via Notification Service.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "minlength8"
}
```

**Success — 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Silva"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Errors:**
- `401` — `INVALID_CREDENTIALS` — Wrong password
- `404` — `USER_NOT_FOUND` — Email not registered

---

### POST /api/auth/refresh

Exchange a refresh token for a new access token.

**Request body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Success — 200:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Errors:**
- `401` — `INVALID_TOKEN` — Revoked or malformed token
- `401` — `TOKEN_EXPIRED` — Refresh token has expired (user must log in again)

---

### POST /api/auth/logout

Revoke a refresh token. Frontend should clear stored tokens regardless of response.

**Request body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Success — 200:**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/verify-token

Used internally by the Gateway to validate a JWT before proxying to protected services.
Also usable by the Account Service to verify tokens.

**Headers:** `Authorization: Bearer <accessToken>`

**Success — 200:**
```json
{
  "valid": true,
  "userId": "uuid"
}
```

**Error — 401:**
```json
{
  "valid": false
}
```

---

### GET /api/auth/me _(protected)_

Get the currently authenticated user's profile.

**Headers:** `Authorization: Bearer <accessToken>`

**Success — 200:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Silva",
    "phone": "+94771234567",
    "createdAt": "2026-03-28T10:00:00.000Z"
  }
}
```

**Errors:**
- `401` — `AUTH_REQUIRED` — Missing or invalid token

---

## Account Service — `/api/accounts/*`

Proxied by Gateway → `http://account-service:3002`

All routes are **protected**. The Gateway verifies the JWT and forwards
`x-user-id: <userId>` header to the Account Service.

---

### GET /api/accounts/me _(protected)_

Get the authenticated user's account details. Auto-creates account if first access.

**Success — 200:**
```json
{
  "account": {
    "id": "uuid",
    "userId": "uuid",
    "accountNumber": "ACC1234567890",
    "balance": 15000.00,
    "currency": "LKR",
    "createdAt": "2026-03-28T10:00:00.000Z"
  }
}
```

---

### GET /api/accounts/me/balance _(protected)_

Get just the current balance and currency.

**Success — 200:**
```json
{
  "balance": 15000.00,
  "currency": "LKR"
}
```

---

### POST /api/accounts/me/deposit _(protected)_

Deposit money into the account. Atomically updates balance and creates transaction record.

**Request body:**
```json
{
  "amount": 5000.00,
  "description": "Salary"
}
```
> `description` is optional. `amount` must be positive.

**Success — 200:**
```json
{
  "transaction": {
    "id": "uuid",
    "accountId": "uuid",
    "type": "DEPOSIT",
    "amount": 5000.00,
    "balanceAfter": 20000.00,
    "description": "Salary",
    "createdAt": "2026-03-28T12:00:00.000Z"
  },
  "newBalance": 20000.00
}
```

**Errors:**
- `400` — `INVALID_AMOUNT` — Amount is zero or negative

---

### POST /api/accounts/me/withdraw _(protected)_

Withdraw money from the account. Atomically validates balance, updates it, and creates record.

**Request body:**
```json
{
  "amount": 2000.00,
  "description": "ATM withdrawal"
}
```

**Success — 200:**
```json
{
  "transaction": {
    "id": "uuid",
    "accountId": "uuid",
    "type": "WITHDRAWAL",
    "amount": 2000.00,
    "balanceAfter": 18000.00,
    "description": "ATM withdrawal",
    "createdAt": "2026-03-28T13:00:00.000Z"
  },
  "newBalance": 18000.00
}
```

**Errors:**
- `400` — `INSUFFICIENT_FUNDS` — Withdrawal amount exceeds available balance
- `400` — `INVALID_AMOUNT` — Amount is zero or negative

---

### GET /api/accounts/me/transactions _(protected)_

Get paginated transaction history, newest first.

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Records per page (max 100) |

**Example:** `GET /api/accounts/me/transactions?page=1&limit=10`

**Success — 200:**
```json
{
  "transactions": [
    {
      "id": "uuid",
      "accountId": "uuid",
      "type": "DEPOSIT",
      "amount": 5000.00,
      "balanceAfter": 20000.00,
      "description": "Salary",
      "createdAt": "2026-03-28T12:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1
}
```

---

## Notification Service — `/api/otp/*`

Proxied by Gateway → `http://notification-service:3003`

---

### POST /api/otp/send _(internal)_

> **Called by Auth Service, not the frontend directly.**
> Auth Service calls this at `http://notification-service:3003/otp/send` inside Docker.

Generates a 6-digit OTP, hashes it, stores it with 5-minute expiry, and emails it.

**Request body:**
```json
{
  "userId": "uuid",
  "email": "user@example.com"
}
```

**Success — 200:**
```json
{
  "message": "OTP sent successfully",
  "otpId": "uuid"
}
```

**Errors:**
- `500` — `EMAIL_DELIVERY_FAILED` — SMTP error

---

### POST /api/otp/verify

Verify the OTP code entered by the user. Called by the frontend via Gateway after login.

**Request body:**
```json
{
  "userId": "uuid",
  "otpCode": "483920"
}
```
> `otpCode` must be exactly 6 digits.

**Success — 200:**
```json
{
  "verified": true
}
```

**Errors:**
- `400` — `INVALID_OTP` — Code does not match
- `410` — `OTP_EXPIRED` — OTP has passed its 5-minute expiry

---

## Inter-Service Communication (internal)

These calls happen inside the Docker network and are NOT exposed to the frontend.

| Caller | Target | Endpoint | When | Payload |
|--------|--------|----------|------|---------|
| Auth Service | Notification Service | `POST /otp/send` | After successful login or registration | `{ userId, email }` |
| API Gateway | Auth Service | `GET /auth/verify-token` | Before proxying any protected route | `Authorization: Bearer <token>` |
| Account Service | Auth Service _(optional)_ | `GET /auth/verify-token` | To validate JWT if not using shared secret | `Authorization: Bearer <token>` |

---

## Full Authentication Flow

```
1. POST /api/auth/register  →  user created, OTP emailed
2. POST /api/otp/verify     →  OTP confirmed, user is authenticated
3. GET  /api/accounts/me    →  account auto-created, balance = 0
4. POST /api/accounts/me/deposit  →  money added
5. POST /api/accounts/me/withdraw →  money removed (if sufficient funds)
6. POST /api/auth/refresh   →  get new accessToken before it expires (15 min)
7. POST /api/auth/logout    →  refresh token revoked
```
