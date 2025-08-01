export interface ErrorMetadata {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

export interface ErrorResponse {
  error: ErrorMetadata;
}
