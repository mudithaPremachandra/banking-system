/**
 * Global Error Handler Middleware
 * OWNER: Sanjaya (API Gateway Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This middleware catches ALL errors thrown in route handlers and returns
 * a consistent error response format to the frontend.
 *
 * ERROR ENVELOPE FORMAT (from architecture doc, page 10):
 * {
 *   "success": false,
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human-readable error message"
 *   }
 * }
 *
 * IMPLEMENTATION:
 * 1. ZodError → 400 with validation details
 * 2. AxiosError (from proxied service) → forward the status code and error body
 * 3. Known error codes → appropriate HTTP status
 * 4. Unknown errors → 500 with generic message (don't leak internals)
 *
 * TODO (Sanjaya):
 * - Import ZodError from zod, AxiosError from axios
 * - Handle each error type differently
 * - Log errors to console in development, structured logging in production
 * - Never expose stack traces to the client
 */
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Gateway Error]", err.message);

  // TODO (Sanjaya): Handle ZodError
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.errors,
      },
    });
    return;
  }

  // TODO (Sanjaya): Handle AxiosError (forwarded from backend service)
  // if (axios.isAxiosError(err) && err.response) {
  //   res.status(err.response.status).json(err.response.data);
  //   return;
  // }

  // Default: 500 Internal Server Error
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}
