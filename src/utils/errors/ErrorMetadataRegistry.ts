import { HTTP_STATUS, HttpStatusCodeType } from "../../config/http.config";
import { ErrorCodeEnumType } from "./errorCodes";

/**
 * Error Metadata Configuration
 *
 * Maps error codes to their metadata including:
 * - HTTP status code
 * - Error category
 * - Default message
 * - Logging level
 * - Retryability
 *
 * @category ErrorManagement
 */

export type ErrorCategory =
  | "authentication"
  | "authorization"
  | "validation"
  | "resource"
  | "system";

type ErrorMetadata = {
  statusCode: HttpStatusCodeType;
  category: ErrorCategory;
  defaultMessage: string;
  logLevel: "error" | "warn" | "info";
  isOperational: boolean;
  retryable?: boolean;
};

export const ErrorMetadataRegistry: Record<ErrorCodeEnumType, ErrorMetadata> = {
  // ======================
  // Authentication Errors
  // ======================
  AUTH_EMAIL_ALREADY_EXISTS: {
    statusCode: HTTP_STATUS.CONFLICT,
    category: "authentication",
    defaultMessage: "Email address is already registered",
    logLevel: "warn",
    isOperational: true,
  },
  AUTH_INVALID_CREDENTIALS: {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    category: "authentication",
    defaultMessage: "Invalid credentials provided",
    logLevel: "warn",
    isOperational: true,
  },
  AUTH_USER_NOT_FOUND: {
    statusCode: HTTP_STATUS.NOT_FOUND,
    category: "authentication",
    defaultMessage: "User not found",
    logLevel: "warn",
    isOperational: true,
  },
  AUTH_TOKEN_EXPIRED: {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    category: "authentication",
    defaultMessage: "Authentication token has expired",
    logLevel: "info",
    isOperational: true,
  },
  AUTH_TOKEN_INVALID: {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    category: "authentication",
    defaultMessage: "Invalid authentication token",
    logLevel: "warn",
    isOperational: true,
  },
  AUTH_TOKEN_REQUIRED: {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    category: "authentication",
    defaultMessage: "Authentication token is required",
    logLevel: "info",
    isOperational: true,
  },
  AUTH_EMAIL_NOT_VERIFIED: {
    statusCode: HTTP_STATUS.FORBIDDEN,
    category: "authentication",
    defaultMessage: "Email address not verified",
    logLevel: "warn",
    isOperational: true,
  },
  AUTH_PASSWORD_RESET_EXPIRED: {
    statusCode: HTTP_STATUS.GONE,
    category: "authentication",
    defaultMessage: "Password reset token has expired",
    logLevel: "info",
    isOperational: true,
  },
  AUTH_OTP_INVALID: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "authentication",
    defaultMessage: "Invalid one-time password (OTP)",
    logLevel: "warn",
    isOperational: true,
  },
  AUTH_OTP_EXPIRED: {
    statusCode: HTTP_STATUS.GONE,
    category: "authentication",
    defaultMessage: "One-time password (OTP) has expired",
    logLevel: "info",
    isOperational: true,
  },

  // ======================
  // Authorization Errors
  // ======================
  ACCESS_UNAUTHORIZED: {
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    category: "authorization",
    defaultMessage: "Unauthorized access",
    logLevel: "warn",
    isOperational: true,
  },
  ACCESS_FORBIDDEN: {
    statusCode: HTTP_STATUS.FORBIDDEN,
    category: "authorization",
    defaultMessage: "Access forbidden",
    logLevel: "warn",
    isOperational: true,
  },
  ACCESS_SUSPENDED: {
    statusCode: HTTP_STATUS.FORBIDDEN,
    category: "authorization",
    defaultMessage: "Account is suspended",
    logLevel: "warn",
    isOperational: true,
  },
  ACCESS_LIMIT_REACHED: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    category: "authorization",
    defaultMessage: "Access limit reached",
    logLevel: "warn",
    isOperational: true,
  },
  ACCESS_ROLE_REQUIRED: {
    statusCode: HTTP_STATUS.FORBIDDEN,
    category: "authorization",
    defaultMessage: "Required role not assigned",
    logLevel: "warn",
    isOperational: true,
  },
  ACCESS_PERMISSION_DENIED: {
    statusCode: HTTP_STATUS.FORBIDDEN,
    category: "authorization",
    defaultMessage: "Permission denied",
    logLevel: "warn",
    isOperational: true,
  },

  // ======================
  // Validation Errors
  // ======================
  VALIDATION_ERROR: {
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    category: "validation",
    defaultMessage: "Validation failed",
    logLevel: "warn",
    isOperational: true,
  },
  INVALID_INPUT: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Invalid input",
    logLevel: "warn",
    isOperational: true,
  },
  MISSING_REQUIRED_FIELD: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Required field is missing",
    logLevel: "warn",
    isOperational: true,
  },
  INVALID_EMAIL_FORMAT: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Invalid email format",
    logLevel: "warn",
    isOperational: true,
  },
  PASSWORD_TOO_WEAK: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Password is too weak",
    logLevel: "warn",
    isOperational: true,
  },
  INVALID_DATE_FORMAT: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Invalid date format",
    logLevel: "warn",
    isOperational: true,
  },
  INVALID_PHONE_FORMAT: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Invalid phone number format",
    logLevel: "warn",
    isOperational: true,
  },
  VALUE_TOO_LONG: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Value exceeds maximum length",
    logLevel: "warn",
    isOperational: true,
  },
  VALUE_TOO_SHORT: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Value does not meet minimum length",
    logLevel: "warn",
    isOperational: true,
  },
  INVALID_FILE_TYPE: {
    statusCode: HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE,
    category: "validation",
    defaultMessage: "Invalid file type uploaded",
    logLevel: "warn",
    isOperational: true,
  },
  FILE_TOO_LARGE: {
    statusCode: HTTP_STATUS.PAYLOAD_TOO_LARGE,
    category: "validation",
    defaultMessage: "Uploaded file is too large",
    logLevel: "warn",
    isOperational: true,
  },

  // ======================
  // Resource Errors
  // ======================
  RESOURCE_NOT_FOUND: {
    statusCode: HTTP_STATUS.NOT_FOUND,
    category: "resource",
    defaultMessage: "Requested resource not found",
    logLevel: "warn",
    isOperational: true,
  },
  RESOURCE_CONFLICT: {
    statusCode: HTTP_STATUS.CONFLICT,
    category: "resource",
    defaultMessage: "Resource conflict occurred",
    logLevel: "warn",
    isOperational: true,
  },
  RESOURCE_LIMIT_REACHED: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    category: "resource",
    defaultMessage: "Resource usage limit reached",
    logLevel: "warn",
    isOperational: true,
  },
  RESOURCE_ALREADY_EXISTS: {
    statusCode: HTTP_STATUS.CONFLICT,
    category: "resource",
    defaultMessage: "Resource already exists",
    logLevel: "warn",
    isOperational: true,
  },
  RESOURCE_STATE_INVALID: {
    statusCode: HTTP_STATUS.CONFLICT,
    category: "resource",
    defaultMessage: "Resource is in an invalid state",
    logLevel: "warn",
    isOperational: true,
  },
  RESOURCE_DEPENDENCY_CONFLICT: {
    statusCode: HTTP_STATUS.CONFLICT,
    category: "resource",
    defaultMessage: "Conflict due to dependent resource",
    logLevel: "warn",
    isOperational: true,
  },

  // ======================
  // System Errors
  // ======================
  INTERNAL_SERVER_ERROR: {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    category: "system",
    defaultMessage: "Internal server error",
    logLevel: "error",
    isOperational: false,
    retryable: true,
  },
  SERVICE_UNAVAILABLE: {
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
    category: "system",
    defaultMessage: "Service temporarily unavailable",
    logLevel: "error",
    isOperational: false,
    retryable: true,
  },
  DATABASE_ERROR: {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    category: "system",
    defaultMessage: "Database operation failed",
    logLevel: "error",
    isOperational: false,
    retryable: true,
  },
  EXTERNAL_SERVICE_ERROR: {
    statusCode: HTTP_STATUS.BAD_GATEWAY,
    category: "system",
    defaultMessage: "External service error",
    logLevel: "error",
    isOperational: false,
    retryable: true,
  },
  FILE_UPLOAD_ERROR: {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    category: "system",
    defaultMessage: "File upload failed",
    logLevel: "error",
    isOperational: false,
    retryable: false,
  },
  FILE_PROCESSING_ERROR: {
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    category: "system",
    defaultMessage: "File processing failed",
    logLevel: "error",
    isOperational: false,
    retryable: false,
  },
  CONFIGURATION_ERROR: {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    category: "system",
    defaultMessage: "Server configuration error",
    logLevel: "error",
    isOperational: false,
    retryable: false,
  },
  FEATURE_NOT_IMPLEMENTED: {
    statusCode: HTTP_STATUS.NOT_IMPLEMENTED,
    category: "system",
    defaultMessage: "Feature not implemented",
    logLevel: "error",
    isOperational: false,
    retryable: false,
  },
  RATE_LIMIT_EXCEEDED: {
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    category: "system",
    defaultMessage: "Rate limit exceeded",
    logLevel: "warn",
    isOperational: true,
  },
  MAINTENANCE_MODE: {
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
    category: "system",
    defaultMessage: "Service under maintenance",
    logLevel: "info",
    isOperational: false,
    retryable: true,
  },
  SYNTAX_ERROR: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Syntax error in request",
    logLevel: "warn",
    isOperational: true,
  },
  JSON_PARSE_ERROR: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    category: "validation",
    defaultMessage: "Invalid JSON format",
    logLevel: "warn",
    isOperational: true,
  },
};
