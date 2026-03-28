/**
 * Gateway Configuration
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * Centralized configuration object. All environment variables used by the
 * gateway are read here. The gateway needs to know:
 * - Its own port
 * - URLs of all backend services (for proxying)
 * - JWT secret (for optional token pre-verification)
 *
 * TODO (Sanjaya):
 * - Add validation: throw an error at startup if required env vars are missing
 *   (consider using Zod for env validation)
 * - In production, all service URLs will use Docker container names
 *   (e.g., http://auth-service:3001)
 * - In development (outside Docker), use localhost URLs
 */
export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  accountServiceUrl: process.env.ACCOUNT_SERVICE_URL || "http://localhost:3002",
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3003",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-here",
};
