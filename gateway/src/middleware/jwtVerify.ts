import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { config } from "../config";

export const jwtVerifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Missing or invalid token" },
      });
    }

    const token = authHeader.split(" ")[1];

    //Call Auth Service
    const response = await axios.get(
      `${config.authServiceUrl}/auth/verify-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // assuming auth service returns { userId: "..." }
    const { userId } = response.data;

    // attach to request
    (req as any).userId = userId;

    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
};