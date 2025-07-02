import { z } from 'zod';

/**
 * Priority enumeration for task importance levels
 */
export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

/**
 * Zod schema for task priority validation
 */
export const PrioritySchema = z.nativeEnum(Priority);

/**
 * Main task entity schema with validation rules
 */
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  dueDate: z.date().optional(),
  priority: PrioritySchema,
  completed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
  orderIndex: z.number().int().min(0, "Order must be non-negative"),
});

/**
 * Task creation input schema (excludes generated fields)
 */
export const CreateTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  dueDate: z.string().datetime().optional().transform((val: string | undefined) => val ? new Date(val) : undefined),
  priority: PrioritySchema,
});

/**
 * Task update input schema (partial with required id)
 */
export const UpdateTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  dueDate: z.string().datetime().optional().transform((val: string | undefined) => val ? new Date(val) : undefined),
  priority: PrioritySchema.optional(),
  completed: z.boolean().optional(),
  completedAt: z.date().optional(),
});

/**
 * Filter configuration schema
 */
export const FilterConfigSchema = z.object({
  status: z.enum(['all', 'completed', 'pending']).optional().default('all'),
  priority: z.union([PrioritySchema, z.literal('all')]).optional().default('all'),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional().transform((val: string | undefined) => val ? new Date(val) : undefined),
  dateTo: z.string().datetime().optional().transform((val: string | undefined) => val ? new Date(val) : undefined),
});

/**
 * Sort configuration schema
 */
export const SortConfigSchema = z.object({
  field: z.enum(['dueDate', 'priority', 'createdAt', 'title', 'orderIndex']).optional().default('createdAt'),
  direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Pagination query schema
 */
export const PaginationQuerySchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

/**
 * Reorder tasks schema
 */
export const ReorderTasksSchema = z.object({
  taskId: z.string().uuid(),
  newOrderIndex: z.number().int().min(0),
});

// TypeScript types derived from Zod schemas
export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type FilterConfig = z.infer<typeof FilterConfigSchema>;
export type SortConfig = z.infer<typeof SortConfigSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type ReorderTasksInput = z.infer<typeof ReorderTasksSchema>; 