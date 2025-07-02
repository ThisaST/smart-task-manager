import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

/**
 * Task routes definition
 * Maps HTTP endpoints to controller methods
 */
export class TaskRoutes {
  private router: Router;
  private taskController: TaskController;

  constructor() {
    this.router = Router();
    this.taskController = new TaskController();
    this.setupRoutes();
  }

  /**
   * Setup all task-related routes
   */
  private setupRoutes(): void {
    // Get all tasks with filtering, sorting, and pagination
    this.router.get('/', this.taskController.getAllTasks);

    // Get task statistics (must be before /:id to avoid conflicts)
    this.router.get('/statistics', this.taskController.getTaskStatistics);

    // Bulk operations
    this.router.post('/bulk', this.taskController.bulkCreateTasks);
    this.router.delete('/bulk', this.taskController.bulkDeleteTasks);
    this.router.patch('/bulk/complete', this.taskController.bulkToggleComplete);

    // Reorder tasks
    this.router.post('/reorder', this.taskController.reorderTask);

    // Single task operations
    this.router.get('/:id', this.taskController.getTaskById);
    this.router.post('/', this.taskController.createTask);
    this.router.put('/:id', this.taskController.updateTask);
    this.router.delete('/:id', this.taskController.deleteTask);

    // Toggle completion status
    this.router.patch('/:id/complete', this.taskController.toggleTaskComplete);
  }

  /**
   * Get the configured router
   */
  public getRouter(): Router {
    return this.router;
  }
}

// Export a function to create routes
export const createTaskRoutes = (): Router => {
  const taskRoutes = new TaskRoutes();
  return taskRoutes.getRouter();
}; 