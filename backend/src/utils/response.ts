import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types/api.types';

/**
 * Send a successful response with data
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  meta?: Partial<PaginationMeta>,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
  };

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: string[],
  code?: string,
  details?: Record<string, any>
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    errors,
  };

  // Add error code and details to response if provided
  if (code || details) {
    (response as any).code = code;
    (response as any).details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a paginated success response
 */
export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message?: string,
  statusCode: number = 200
): Response => {
  return sendSuccess(res, data, message, meta, statusCode);
};

/**
 * Send a created response (201)
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return sendSuccess(res, data, message, undefined, 201);
};

/**
 * Send a no content response (204)
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    total,
    page,
    limit,
    hasMore,
    totalPages,
  };
}; 