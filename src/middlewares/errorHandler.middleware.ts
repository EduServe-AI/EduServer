import { Request, Response, ErrorRequestHandler } from "express";
import z from "zod";

import {
  InternalServerError,
  JsonParseError,
  ZodValidationError,
} from "../utils/errors/specificErrors";
import { AppError } from "../utils/errors/appError";
import { ErrorResponse } from "../types/error";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): void => {
  const isDevelopment = process.env.NODE_ENV === "development";

  logError(error, req, isDevelopment);

  if (error instanceof z.ZodError) {
    return handleAppError(
      new ZodValidationError(error),
      req,
      res,
      isDevelopment
    );
  }

  if (error instanceof AppError) {
    return handleAppError(error, req, res, isDevelopment);
  }

  const unknownError = new InternalServerError({
    message: "An unexpected error occurred",
    details: isDevelopment ? getErrorMessage(error) : undefined,
  });

  return handleAppError(unknownError, req, res, isDevelopment);
};

function handleAppError(
  err: AppError,
  req: Request,
  res: Response,
  isDevelopment: boolean
): void {
  const response: ErrorResponse = {
    error: {
      code: err.code,
      message: err.message,
      ...(isDevelopment && {
        details: err.details,
        stack: err.stack,
      }),
    },
  };

  res.status(err.statusCode).json(response);
}

function logError(error: unknown, req: Request, isDevelopment: boolean): void {
  console.error(`[Error ${new Date().toISOString()}]`, {
    path: req.path,
    method: req.method,
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: isDevelopment ? error.stack : undefined,
          }
        : String(error),
  });
}

function isJsonParseError(
  error: unknown
): error is SyntaxError & { status: number; body: unknown } {
  return (
    error instanceof SyntaxError &&
    typeof (error as any).status === "number" &&
    (error as any).status === 400 &&
    "body" in error
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
