/**
 * Application Error Codes
 *
 * Organized by categories with clear documentation for each error type.
 * Follows pattern: <DOMAIN>_<DESCRIPTION> for consistency.
 *
 * @category ErrorManagement
 */
export const ErrorCodeEnum = {
  // ======================
  // Authentication Errors (4XX)
  // ======================

  /** Email already exists during registration. HTTP 409 Conflict */
  AUTH_EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS",

  /** Provided credentials are invalid. HTTP 401 Unauthorized */
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",

  /** User not found in the system. HTTP 404 Not Found */
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",

  /** Authentication token has expired. HTTP 401 Unauthorized */
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",

  /** Authentication token is invalid. HTTP 401 Unauthorized */
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",

  /** Authentication token is required but missing. HTTP 401 Unauthorized */
  AUTH_TOKEN_REQUIRED: "AUTH_TOKEN_REQUIRED",

  /** Email not verified yet. HTTP 403 Forbidden */
  AUTH_EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED",

  /** Password reset token has expired. HTTP 410 Gone */
  AUTH_PASSWORD_RESET_EXPIRED: "AUTH_PASSWORD_RESET_EXPIRED",

  /** Provided OTP is invalid. HTTP 400 Bad Request */
  AUTH_OTP_INVALID: "AUTH_OTP_INVALID",

  /** OTP has expired. HTTP 410 Gone */
  AUTH_OTP_EXPIRED: "AUTH_OTP_EXPIRED",

  // ======================
  // Authorization Errors (4XX)
  // ======================

  /** User is not authorized (unauthenticated). HTTP 401 Unauthorized */
  ACCESS_UNAUTHORIZED: "ACCESS_UNAUTHORIZED",

  /** Access is forbidden due to insufficient privileges. HTTP 403 Forbidden */
  ACCESS_FORBIDDEN: "ACCESS_FORBIDDEN",

  /** Account is suspended. HTTP 403 Forbidden */
  ACCESS_SUSPENDED: "ACCESS_SUSPENDED",

  /** User reached access or usage limits. HTTP 429 Too Many Requests */
  ACCESS_LIMIT_REACHED: "ACCESS_LIMIT_REACHED",

  /** Required role not assigned to user. HTTP 403 Forbidden */
  ACCESS_ROLE_REQUIRED: "ACCESS_ROLE_REQUIRED",

  /** Permission denied for the requested operation. HTTP 403 Forbidden */
  ACCESS_PERMISSION_DENIED: "ACCESS_PERMISSION_DENIED",

  // ======================
  // Validation Errors (4XX)
  // ======================

  /** Request body is not valid JSON. HTTP 400 Bad Request */
  SYNTAX_ERROR: "SYNTAX_ERROR", // 400 - Malformed request syntax

  /** General validation error. HTTP 422 Unprocessable Entity */
  VALIDATION_ERROR: "VALIDATION_ERROR",

  /** One or more inputs are invalid. HTTP 400 Bad Request */
  INVALID_INPUT: "INVALID_INPUT",

  /** A required field is missing. HTTP 400 Bad Request */
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  /** Email format is invalid. HTTP 400 Bad Request */
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",

  /** Password does not meet security criteria. HTTP 400 Bad Request */
  PASSWORD_TOO_WEAK: "PASSWORD_TOO_WEAK",

  /** Date format is invalid. HTTP 400 Bad Request */
  INVALID_DATE_FORMAT: "INVALID_DATE_FORMAT",

  /** URL format is invalid. HTTP 400 Bad Request */
  JSON_PARSE_ERROR: "JSON_PARSE_ERROR",

  /** Phone number format is invalid. HTTP 400 Bad Request */
  INVALID_PHONE_FORMAT: "INVALID_PHONE_FORMAT",

  /** Field value is too long. HTTP 400 Bad Request */
  VALUE_TOO_LONG: "VALUE_TOO_LONG",

  /** Field value is too short. HTTP 400 Bad Request */
  VALUE_TOO_SHORT: "VALUE_TOO_SHORT",

  /** Uploaded file type is not supported. HTTP 415 Unsupported Media Type */
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",

  /** Uploaded file is too large. HTTP 413 Payload Too Large */
  FILE_TOO_LARGE: "FILE_TOO_LARGE",

  // ======================
  // Resource Errors (4XX)
  // ======================

  /** Requested resource was not found. HTTP 404 Not Found */
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

  /** Conflict with an existing resource. HTTP 409 Conflict */
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT",

  /** Resource limit has been reached. HTTP 429 Too Many Requests */
  RESOURCE_LIMIT_REACHED: "RESOURCE_LIMIT_REACHED",

  /** Resource already exists. HTTP 409 Conflict */
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",

  /** Resource is in an invalid state for the operation. HTTP 409 Conflict or 422 Unprocessable Entity */
  RESOURCE_STATE_INVALID: "RESOURCE_STATE_INVALID",

  /** Conflict due to a dependent resource state. HTTP 409 Conflict */
  RESOURCE_DEPENDENCY_CONFLICT: "RESOURCE_DEPENDENCY_CONFLICT",

  // ======================
  // System Errors (5XX)
  // ======================

  /** Unexpected server error. HTTP 500 Internal Server Error */
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",

  /** Service is temporarily unavailable. HTTP 503 Service Unavailable */
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

  /** Error occurred while interacting with the database. HTTP 500 Internal Server Error */
  DATABASE_ERROR: "DATABASE_ERROR",

  /** External service returned an error. HTTP 502 Bad Gateway or 503 */
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",

  /** File upload failed due to server-side issues. HTTP 500 or 413 */
  FILE_UPLOAD_ERROR: "FILE_UPLOAD_ERROR",

  /** File processing failed after upload. HTTP 422 or 500 */
  FILE_PROCESSING_ERROR: "FILE_PROCESSING_ERROR",

  /** Server configuration error. HTTP 500 Internal Server Error */
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",

  /** Feature is not yet implemented. HTTP 501 Not Implemented */
  FEATURE_NOT_IMPLEMENTED: "FEATURE_NOT_IMPLEMENTED",

  /** Too many requests made in a short time. HTTP 429 Too Many Requests */
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  /** Application is in maintenance mode. HTTP 503 Service Unavailable */
  MAINTENANCE_MODE: "MAINTENANCE_MODE",
} as const;

export type ErrorCodeEnumType = keyof typeof ErrorCodeEnum;
