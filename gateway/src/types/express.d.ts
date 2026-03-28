/**
 * Express Type Extensions
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * This declaration file extends the Express Request interface to include
 * custom properties set by middleware (e.g., JWT verification adds userId).
 *
 * TODO (Sanjaya): Ensure tsconfig.json includes this file in compilation
 */
declare namespace Express {
  interface Request {
    userId?: string;
    userEmail?: string;
  }
}
