/**
 * Priority enumeration matching backend
 */
export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

/**
 * Task entity type matching backend API
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | string;
  priority: Priority;
  completed: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  orderIndex: number;
}

/**
 * Task creation input (excludes generated fields)
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string; // ISO string format
  priority: Priority;
}

/**
 * Task update input (partial)
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string; // ISO string format
  priority?: Priority;
  completed?: boolean;
  completedAt?: string; // ISO string format
}

/**
 * Filter configuration for task queries
 */
export interface FilterConfig {
  status: 'all' | 'completed' | 'pending';
  priority: 'all' | Priority;
  searchQuery?: string;
}

/**
 * Sort configuration for task queries
 */
export interface SortConfig {
  field: 'dueDate' | 'priority' | 'createdAt' | 'title' | 'orderIndex';
  direction: 'asc' | 'desc';
}

/**
 * Task counts for dashboard and filters
 */
export interface TaskCounts {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
}

/**
 * Component prop types
 */
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

/**
 * Legacy type aliases for backward compatibility
 */
export type TaskStatus = 'all' | 'completed' | 'pending';
export type PriorityFilter = Priority | 'all'; 