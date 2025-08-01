import z from "zod";
import { HTTP_STATUS, HttpStatusCodeType } from "../../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "./errorCodes";
import { ErrorCategory, ErrorMetadataRegistry } from "./ErrorMetadataRegistry";

/**
 * Base Application Error Class
 *
 * Extends native Error with additional properties for
 * better error handling and logging.
 *
 * @category ErrorManagement
 */

interface ErrorMetadata {
  statusCode: HttpStatusCodeType;
  category: ErrorCategory;
  defaultMessage: string;
  logLevel: "error" | "warn" | "info";
  isOperational: boolean;
  retryable?: boolean;
}

export class AppError extends Error {
  public readonly code: ErrorCodeEnumType;
  public readonly statusCode: HttpStatusCodeType;
  public readonly category: ErrorCategory;
  public readonly timestamp: Date;
  public readonly details?: unknown;
  public readonly isOperational: boolean;
  public readonly retryable?: boolean;

  constructor(params: {
    code: ErrorCodeEnumType;
    message?: string;
    details?: unknown;
    overrideMetadata?: Partial<ErrorMetadata>;
  }) {
    const metadata = {
      ...ErrorMetadataRegistry[params.code],
      ...params.overrideMetadata,
    };

    super(params.message || metadata.defaultMessage);

    this.name = "AppError";
    this.code = params.code;
    this.statusCode = metadata.statusCode;
    this.category = metadata.category;
    this.isOperational = metadata.isOperational;
    this.retryable = metadata.retryable;
    this.details = params.details;
    this.timestamp = new Date();

    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      category: this.category,
      timestamp: this.timestamp.toISOString(),
      ...(this.details ? { details: this.details } : {}),
    };
  }
}
