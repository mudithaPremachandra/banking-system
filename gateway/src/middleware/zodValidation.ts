/**
 * Zod Validation Middleware Factory
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is a reusable middleware factory that creates Express middleware from
 * a Zod schema. Use it to validate request bodies before proxying.
 *
 * USAGE IN ROUTES:
 *   import { validate } from "../middleware/zodValidation";
 *   import { loginSchema } from "../schemas";
 *   router.post("/login", validate(loginSchema), proxyToAuthService);
 *
 * IMPLEMENTATION:
 * - Takes a Zod schema as input
 * - Returns an Express middleware function
 * - Parses req.body against the schema
 * - On success: replaces req.body with parsed (sanitized) data, calls next()
 * - On failure: passes ZodError to next(err) → caught by errorHandler
 *
 * TODO (Sanjaya):
 * - Implement the validate function
 * - Optionally add validateQuery() for query parameter validation
 * - Optionally add validateParams() for route parameter validation
 */
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse and sanitize the request body
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      // Pass ZodError to the global error handler
      next(err);
    }
  };
}

/**
 * Validate query parameters
 * TODO (Sanjaya): Implement if needed for pagination endpoints
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (err) {
      next(err);
    }
  };
}
