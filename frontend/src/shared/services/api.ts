import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import type { 
  ApiResponse, 
  ApiError, 
  TaskQueryParams,
  TaskStatistics,
  BulkDeleteRequest,
  BulkCompleteRequest,
  ReorderTaskRequest
} from '../types/api';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/modules/tasks/types/task.types';

/**
 * API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Response interceptor to handle API responses consistently
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiError>) => {
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * API service for task operations
 */
export class TaskAPI {
  /**
   * Get paginated list of tasks with filtering and sorting
   */
  static async getTasks(params?: TaskQueryParams): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data;
  }

  /**
   * Get a specific task by ID
   */
  static async getTask(id: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  }

  /**
   * Create a new task
   */
  static async createTask(task: CreateTaskInput): Promise<ApiResponse<Task>> {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', task);
    return response.data;
  }

  /**
   * Update an existing task
   */
  static async updateTask(id: string, task: UpdateTaskInput): Promise<ApiResponse<Task>> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    return response.data;
  }

  /**
   * Delete a task
   */
  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/tasks/${id}`);
    return response.data;
  }

  /**
   * Toggle task completion status
   */
  static async toggleTaskComplete(id: string): Promise<ApiResponse<Task>> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/complete`);
    return response.data;
  }

  /**
   * Get task statistics for dashboard
   */
  static async getTaskStatistics(): Promise<ApiResponse<TaskStatistics>> {
    const response = await apiClient.get<ApiResponse<TaskStatistics>>('/tasks/statistics');
    return response.data;
  }

  /**
   * Reorder a task
   */
  static async reorderTask(request: ReorderTaskRequest): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.post<ApiResponse<Task[]>>('/tasks/reorder', request);
    return response.data;
  }

  /**
   * Bulk delete tasks
   */
  static async bulkDeleteTasks(request: BulkDeleteRequest): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>('/tasks/bulk', { data: request });
    return response.data;
  }

  /**
   * Bulk toggle completion status
   */
  static async bulkToggleComplete(request: BulkCompleteRequest): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.patch<ApiResponse<Task[]>>('/tasks/bulk/complete', request);
    return response.data;
  }

  /**
   * Bulk create tasks
   */
  static async bulkCreateTasks(tasks: CreateTaskInput[]): Promise<ApiResponse<Task[]>> {
    const response = await apiClient.post<ApiResponse<Task[]>>('/tasks/bulk', { tasks });
    return response.data;
  }
}

/**
 * Health check endpoint
 */
export class HealthAPI {
  static async getHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    const response = await apiClient.get<ApiResponse<{ status: string; timestamp: string }>>('/health');
    return response.data;
  }
}

/**
 * Export the configured axios instance for direct use if needed
 */
export { apiClient }; 