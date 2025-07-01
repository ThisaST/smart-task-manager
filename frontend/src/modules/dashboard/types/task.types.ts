import { z } from 'zod';


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
  dueDate: z.date(),
  priority: PrioritySchema,
  completed: z.boolean().default(false),
  createdDate: z.date(),
  modifiedDate: z.date(),
});

/**
 * Task creation input schema (excludes generated fields)
 */
export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  completed: true,
  createdDate: true,
  modifiedDate: true,
});

/**
 * Task update input schema (partial with required id)
 */
export const UpdateTaskSchema = TaskSchema.partial().extend({
  id: z.string().uuid(),
});

/**
 * Filter configuration schema
 */
export const FilterConfigSchema = z.object({
  status: z.enum(['all', 'completed', 'pending']).default('all'),
  priority: z.union([PrioritySchema, z.literal('all')]).default('all'),
  searchQuery: z.string().default(''),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type FilterConfig = z.infer<typeof FilterConfigSchema>;

export type TaskStatus = 'all' | 'completed' | 'pending';
export type PriorityFilter = Priority | 'all';

export interface TaskItemProps {
  task: Task;
  index?: number;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onSelect?: (taskId: string) => void;
  selectedTasks?: string[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
} 