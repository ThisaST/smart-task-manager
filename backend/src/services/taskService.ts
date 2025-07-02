import { TaskRepository } from '../repositories/taskRepository';
import { Task, CreateTaskInput, UpdateTaskInput, FilterConfig, SortConfig, Priority } from '../types/task.types';
import { PaginatedResult } from '../types/api.types';
import { NotFoundError, ValidationError } from '../utils/errors';

/**
 * Task service layer containing business logic
 */
export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Get all tasks with filtering, sorting, and pagination
   */
  async getAllTasks(
    filters: FilterConfig = { status: 'all', priority: 'all' },
    sort: SortConfig = { field: 'createdAt', direction: 'desc' },
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<Task>> {
    if (page < 1) {
      throw new ValidationError('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    return await this.taskRepository.findMany(filters, sort, page, limit);
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    // Validate UUID format
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid task ID format');
    }

    const task = await this.taskRepository.findById(id);
    
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  /**
   * Create a new task with business logic validation
   */
  async createTask(taskData: CreateTaskInput): Promise<Task> {
    // Business logic: Validate due date for high priority tasks
    if (taskData.priority === Priority.HIGH && !taskData.dueDate) {
      throw new ValidationError('High priority tasks must have a due date');
    }

    // Business logic: Validate due date is in the future
    if (taskData.dueDate && taskData.dueDate <= new Date()) {
      throw new ValidationError('Due date must be in the future');
    }

    const task = await this.taskRepository.create(taskData);
    return task;
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, updateData: UpdateTaskInput): Promise<Task> {
    // Validate UUID format
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid task ID format');
    }

    const existingTask = await this.taskRepository.findById(id);
    
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    // Business logic: Validate due date for high priority tasks
    const newPriority = updateData.priority ?? existingTask.priority;
    const newDueDate = updateData.dueDate ?? existingTask.dueDate;
    
    if (newPriority === Priority.HIGH && !newDueDate) {
      throw new ValidationError('High priority tasks must have a due date');
    }

    // Business logic: Validate due date is in the future (if provided)
    if (updateData.dueDate && updateData.dueDate <= new Date()) {
      throw new ValidationError('Due date must be in the future');
    }

    // Business logic: Handle completion logic
    if (updateData.completed !== undefined && updateData.completed !== existingTask.completed) {
      updateData.completedAt = updateData.completed ? new Date() : undefined;
    }

    const updatedTask = await this.taskRepository.update(id, updateData);
    return updatedTask;
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    // Validate UUID format
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid task ID format');
    }

    const existingTask = await this.taskRepository.findById(id);
    
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    await this.taskRepository.delete(id);
  }

  /**
   * Toggle task completion status
   */
  async toggleTaskComplete(id: string): Promise<Task> {
    // Validate UUID format
    if (!this.isValidUUID(id)) {
      throw new ValidationError('Invalid task ID format');
    }

    const existingTask = await this.taskRepository.findById(id);
    
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    const updatedTask = await this.taskRepository.toggleComplete(id);
    return updatedTask;
  }

  /**
   * Reorder tasks
   */
  async reorderTask(taskId: string, newOrderIndex: number): Promise<void> {
    // Validate UUID format
    if (!this.isValidUUID(taskId)) {
      throw new ValidationError('Invalid task ID format');
    }

    // Validate order index
    if (newOrderIndex < 0) {
      throw new ValidationError('Order index must be non-negative');
    }

    const existingTask = await this.taskRepository.findById(taskId);
    
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    await this.taskRepository.reorderTask(taskId, newOrderIndex);
  }

  /**
   * Get task statistics
   */
  async getTaskStatistics(): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    completionRate: number;
    byPriority: { priority: number; count: number; label: string }[];
  }> {
    const stats = await this.taskRepository.getStatistics();
    
    const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    
    const byPriorityWithLabels = stats.byPriority.map(item => ({
      ...item,
      label: this.getPriorityLabel(item.priority),
    }));

    return {
      ...stats,
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      byPriority: byPriorityWithLabels,
    };
  }

  /**
   * Bulk delete tasks
   */
  async bulkDeleteTasks(taskIds: string[]): Promise<void> {
    // Validate all task IDs
    const invalidIds = taskIds.filter(id => !this.isValidUUID(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(`Invalid task ID format: ${invalidIds.join(', ')}`);
    }

    // Check if all tasks exist
    const tasks = await Promise.all(
      taskIds.map(id => this.taskRepository.findById(id))
    );
    
    const notFoundIds = taskIds.filter((id, index) => !tasks[index]);
    if (notFoundIds.length > 0) {
      throw new NotFoundError(`Tasks not found: ${notFoundIds.join(', ')}`);
    }

    // Delete all tasks
    await Promise.all(
      taskIds.map(id => this.taskRepository.delete(id))
    );
  }

  /**
   * Bulk update task completion status
   */
  async bulkToggleComplete(taskIds: string[], completed: boolean): Promise<Task[]> {
    // Validate all task IDs
    const invalidIds = taskIds.filter(id => !this.isValidUUID(id));
    if (invalidIds.length > 0) {
      throw new ValidationError(`Invalid task ID format: ${invalidIds.join(', ')}`);
    }

    // Update all tasks
    const updatedTasks = await Promise.all(
      taskIds.map(async (id) => {
        const task = await this.taskRepository.findById(id);
        if (!task) {
          throw new NotFoundError(`Task not found: ${id}`);
        }
        
        return await this.taskRepository.update(id, {
          completed,
          completedAt: completed ? new Date() : undefined,
        });
      })
    );

    return updatedTasks;
  }

  /**
   * Bulk create tasks
   */
  async bulkCreateTasks(tasksData: CreateTaskInput[]): Promise<Task[]> {
    // Validate business rules for each task
    tasksData.forEach((taskData, index) => {
      // Business logic: Validate due date for high priority tasks
      if (taskData.priority === Priority.HIGH && !taskData.dueDate) {
        throw new ValidationError(`Task at index ${index}: High priority tasks must have a due date`);
      }

      // Business logic: Validate due date is in the future (if provided)
      if (taskData.dueDate && taskData.dueDate <= new Date()) {
        throw new ValidationError(`Task at index ${index}: Due date must be in the future`);
      }
    });

    return await this.taskRepository.bulkCreate(tasksData);
  }

  /**
   * Helper method to validate UUID format
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Helper method to get priority label
   */
  private getPriorityLabel(priority: number): string {
    switch (priority) {
      case Priority.LOW:
        return 'Low';
      case Priority.MEDIUM:
        return 'Medium';
      case Priority.HIGH:
        return 'High';
      default:
        return 'Unknown';
    }
  }

  /**
   * Cleanup - close repository connections
   */
  async cleanup(): Promise<void> {
    await this.taskRepository.disconnect();
  }
} 