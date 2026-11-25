import { Request, Response, NextFunction } from "express";
import { ExternalApiError } from "../types/app-error";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(error);

  if (error instanceof ExternalApiError) {
    res.status(503).json({
      error: "External data source unavailable",
      details: error.details,
    });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
  });
}
