import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { 
  CreateTaskSchema, 
  UpdateTaskSchema, 
  FilterConfigSchema, 
  SortConfigSchema, 
  PaginationQuerySchema,
  ReorderTasksSchema 
} from '../types/task.types';
import { sendSuccess, sendCreated, sendNoContent, sendPaginatedSuccess } from '../utils/response';
import { ValidationError } from '../utils/errors';

/**
 * Task controller handling HTTP requests for task operations
 */
export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * GET /api/tasks - Get all tasks with filtering, sorting, and pagination
   */
  getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      // Parse and validate filters
      const filters = FilterConfigSchema.parse({
        status: req.query.status,
        priority: req.query.priority === 'all' ? 'all' : parseInt(req.query.priority as string),
        search: req.query.search,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      });

      // Parse and validate sort
      const sort = SortConfigSchema.parse({
        field: req.query.sortBy || 'createdAt',
        direction: req.query.sortOrder || 'desc',
      });

      const result = await this.taskService.getAllTasks(filters, sort, page, limit);

      sendPaginatedSuccess(res, result.data, result.meta, 'Tasks retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/tasks/:id - Get a single task by ID
   */
  getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);

      sendSuccess(res, task, 'Task retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/tasks - Create a new task
   */
  createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = CreateTaskSchema.parse(req.body);
      const task = await this.taskService.createTask(validatedData);

      sendCreated(res, task, 'Task created successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/tasks/:id - Update a task
   */
  updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = UpdateTaskSchema.parse(req.body);
      
      const task = await this.taskService.updateTask(id, validatedData);

      sendSuccess(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/tasks/:id - Delete a task
   */
  deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id);

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/tasks/:id/complete - Toggle task completion status
   */
  toggleTaskComplete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskService.toggleTaskComplete(id);

      sendSuccess(res, task, 'Task completion status updated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/tasks/reorder - Reorder a task
   */
  reorderTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = ReorderTasksSchema.parse(req.body);
      await this.taskService.reorderTask(validatedData.taskId, validatedData.newOrderIndex);

      sendSuccess(res, null, 'Task reordered successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/tasks/statistics - Get task statistics
   */
  getTaskStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statistics = await this.taskService.getTaskStatistics();

      sendSuccess(res, statistics, 'Task statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/tasks/bulk - Bulk delete tasks
   */
  bulkDeleteTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { taskIds } = req.body;
      
      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        throw new ValidationError('taskIds must be a non-empty array');
      }

      await this.taskService.bulkDeleteTasks(taskIds);

      sendSuccess(res, null, `${taskIds.length} tasks deleted successfully`);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/tasks/bulk/complete - Bulk update task completion status
   */
  bulkToggleComplete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { taskIds, completed } = req.body;
      
      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        throw new ValidationError('taskIds must be a non-empty array');
      }

      if (typeof completed !== 'boolean') {
        throw new ValidationError('completed must be a boolean value');
      }

      const tasks = await this.taskService.bulkToggleComplete(taskIds, completed);

      sendSuccess(
        res, 
        tasks, 
        `${taskIds.length} tasks ${completed ? 'completed' : 'marked as pending'} successfully`
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/tasks/bulk - Bulk create tasks
   */
  bulkCreateTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tasks } = req.body;
      
      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new ValidationError('tasks must be a non-empty array');
      }

      if (tasks.length > 1000) {
        throw new ValidationError('Cannot create more than 1000 tasks at once');
      }

      // Validate each task
      const validatedTasks = tasks.map(task => CreateTaskSchema.parse(task));
      
      const createdTasks = await this.taskService.bulkCreateTasks(validatedTasks);

      sendCreated(res, createdTasks, `${createdTasks.length} tasks created successfully`);
    } catch (error) {
      next(error);
    }
  };
} 