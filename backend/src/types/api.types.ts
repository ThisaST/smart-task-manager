import { z } from 'zod';

/**
 * Standard API response wrapper schema
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
    meta: z.object({
      total: z.number().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      hasMore: z.boolean().optional(),
      totalPages: z.number().optional(),
    }).optional(),
  });

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
  code: z.string().optional(),
  details: z.record(z.any()).optional(),
});

/**
 * Success response schema
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    meta: z.object({
      total: z.number().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      hasMore: z.boolean().optional(),
      totalPages: z.number().optional(),
    }).optional(),
  });

// API response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
    totalPages?: number;
  };
};

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
    totalPages?: number;
  };
};

/**
 * Pagination metadata type
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

/**
 * Query result with pagination
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
} 