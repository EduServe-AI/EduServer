/**
 * Error Code Enumeration
 *
 * Categorizes all application error codes with clear descriptions.
 * Each code follows the pattern: <DOMAIN>_<DESCRIPTION>
 */
export const ErrorCodeEnum = {
  // ======================
  // Authentication Errors (4XX)
  // ======================
  AUTH_EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS", // 409 - Email conflict
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS", // 401 - Bad login
  AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND", // 404 - No user exists
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED", // 401 - JWT expired
  AUTH_TOKEN_NOT_FOUND: "AUTH_TOKEN_NOT_FOUND", // 401 - Missing token
  AUTH_TOO_MANY_ATTEMPTS: "AUTH_TOO_MANY_ATTEMPTS", // 429 - Rate limiting
  AUTH_EMAIL_NOT_VERIFIED: "AUTH_EMAIL_NOT_VERIFIED", // 403 - Pending verification

  // ======================
  // Authorization Errors (4XX)
  // ======================
  ACCESS_UNAUTHORIZED: "ACCESS_UNAUTHORIZED", // 403 - Insufficient permissions
  ACCESS_FORBIDDEN: "ACCESS_FORBIDDEN", // 403 - Explicit deny
  ACCESS_SUSPENDED: "ACCESS_SUSPENDED", // 403 - Account suspended

  // ======================
  // Validation Errors (4XX)
  // ======================
  VALIDATION_ERROR: "VALIDATION_ERROR", // 400 - General validation
  INVALID_INPUT: "INVALID_INPUT", // 400 - Bad request data
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD", // 400 - Required param

  // ======================
  // Resource Errors (4XX)
  // ======================
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND", // 404 - Entity missing
  RESOURCE_CONFLICT: "RESOURCE_CONFLICT", // 409 - Version/state conflict

  // ======================
  // System Errors (5XX)
  // ======================
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR", // 500 - Unhandled exception
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE", // 503 - Down for maintenance
  DATABASE_ERROR: "DATABASE_ERROR", // 500 - DB operation failed
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR", // 502 - Third-party API fail
} as const;

/**
 * Type derived from ErrorCodeEnum
 *
 * Usage:
 * function handleError(code: ErrorCodeEnumType) {
 *   // type-safe error handling
 * }
 */
export type ErrorCodeEnumType = keyof typeof ErrorCodeEnum;
