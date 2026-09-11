/**
 * Structured application error. Throw this anywhere in a controller
 * (or a future service/repository layer) and the centralized error
 * handler will translate it into a consistent JSON response.
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
