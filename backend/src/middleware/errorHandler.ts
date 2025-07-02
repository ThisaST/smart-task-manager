import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/errors';
import { sendError } from '../utils/response';

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map(error => {
      const path = error.path.join('.');
      return `${path}: ${error.message}`;
    });

    sendError(
      res,
      'Validation failed',
      400,
      errors,
      'VALIDATION_ERROR'
    );
    return;
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    sendError(
      res,
      err.message,
      err.statusCode,
      undefined,
      err.code,
      err.details
    );
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case 'P2002':
        sendError(res, 'A record with this data already exists', 409, undefined, 'UNIQUE_CONSTRAINT_VIOLATION');
        return;
      case 'P2025':
        sendError(res, 'Record not found', 404, undefined, 'RECORD_NOT_FOUND');
        return;
      case 'P2003':
        sendError(res, 'Foreign key constraint violation', 400, undefined, 'FOREIGN_KEY_VIOLATION');
        return;
      default:
        sendError(res, 'Database error occurred', 500, undefined, 'DATABASE_ERROR');
        return;
    }
  }

  // Handle other Prisma errors
  if (err.name === 'PrismaClientValidationError') {
    sendError(res, 'Invalid data provided', 400, undefined, 'PRISMA_VALIDATION_ERROR');
    return;
  }

  if (err.name === 'PrismaClientUnknownRequestError') {
    sendError(res, 'Unknown database error', 500, undefined, 'UNKNOWN_DATABASE_ERROR');
    return;
  }

  // Handle JWT errors (if authentication is implemented)
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, undefined, 'INVALID_TOKEN');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, undefined, 'TOKEN_EXPIRED');
    return;
  }

  // Handle syntax errors (malformed JSON)
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON format', 400, undefined, 'INVALID_JSON');
    return;
  }

  // Default error response for unhandled errors
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction ? 'Internal server error' : err.message;
  const details = isProduction ? undefined : { stack: err.stack };

  sendError(
    res,
    message,
    500,
    undefined,
    'INTERNAL_SERVER_ERROR',
    details
  );
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(
    res,
    `Route ${req.originalUrl} not found`,
    404,
    undefined,
    'ROUTE_NOT_FOUND'
  );
}; 