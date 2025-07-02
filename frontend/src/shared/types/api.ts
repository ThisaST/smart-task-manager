/**
 * API response types matching backend structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Query parameters for API requests
 */
export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'completed' | 'pending';
  priority?: 'all' | number;
  search?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title' | 'orderIndex';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Task statistics from backend
 */
export interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    [key: string]: {
      priority: number;
      count: number;
      label: string;
    };
  };
}

/**
 * Bulk operation requests
 */
export interface BulkDeleteRequest {
  taskIds: string[];
}

export interface BulkCompleteRequest {
  taskIds: string[];
  completed: boolean;
}

/**
 * Task reorder request
 */
export interface ReorderTaskRequest {
  taskId: string;
  newOrderIndex: number;
} 