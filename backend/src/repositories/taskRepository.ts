import { PrismaClient } from '@prisma/client';
import { Task, CreateTaskInput, UpdateTaskInput, FilterConfig, SortConfig } from '../types/task.types';
import { PaginatedResult } from '../types/api.types';
import { DatabaseError } from '../utils/errors';

/**
 * Task repository handling database operations
 * Abstracts database-specific implementation details
 */
export class TaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Find multiple tasks with filtering, sorting, and pagination
   */
  async findMany(
    filters: FilterConfig,
    sort: SortConfig,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResult<Task>> {
    try {
      const offset = (page - 1) * limit;
      const where: any = {};

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        where.completed = filters.status === 'completed';
      }

      if (filters.priority && filters.priority !== 'all') {
        where.priority = filters.priority;
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.dateFrom || filters.dateTo) {
        where.dueDate = {};
        if (filters.dateFrom) {
          where.dueDate.gte = filters.dateFrom;
        }
        if (filters.dateTo) {
          where.dueDate.lte = filters.dateTo;
        }
      }

      // Build orderBy
      const orderBy: any = {};
      if (sort.field === 'priority') {
        // For priority, we want High (3) -> Medium (2) -> Low (1) when desc
        orderBy.priority = sort.direction === 'desc' ? 'desc' : 'asc';
      } else if (sort.field === 'dueDate') {
        // Handle null values - put them last
        orderBy.dueDate = { sort: sort.direction, nulls: 'last' };
      } else {
        orderBy[sort.field] = sort.direction;
      }

      const [tasks, total] = await Promise.all([
        this.prisma.task.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
        }),
        this.prisma.task.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      return {
        data: tasks as Task[],
        meta: {
          total,
          page,
          limit,
          hasMore,
          totalPages,
        },
      };
    } catch (error) {
      throw new DatabaseError(`Failed to fetch tasks: ${error}`);
    }
  }

  /**
   * Find a single task by ID
   */
  async findById(id: string): Promise<Task | null> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      return task as Task | null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch task: ${error}`);
    }
  }

  /**
   * Create a new task
   */
  async create(data: CreateTaskInput): Promise<Task> {
    try {
      // Get the next order index
      const maxOrder = await this.getMaxOrderIndex();
      
      const task = await this.prisma.task.create({
        data: {
          ...data,
          orderIndex: maxOrder + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return task as Task;
    } catch (error) {
      throw new DatabaseError(`Failed to create task: ${error}`);
    }
  }

  /**
   * Bulk create tasks
   */
  async bulkCreate(tasksData: CreateTaskInput[]): Promise<Task[]> {
    try {
      // Get the starting order index
      const maxOrder = await this.getMaxOrderIndex();
      
      // Prepare data with order indices
      const tasksWithOrder = tasksData.map((data, index) => ({
        ...data,
        orderIndex: maxOrder + index + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Use createMany for better performance
      await this.prisma.task.createMany({
        data: tasksWithOrder,
      });

      // Since createMany doesn't return the created records, we need to fetch them
      // Get the tasks we just created by their order indices
      const startOrderIndex = maxOrder + 1;
      const endOrderIndex = maxOrder + tasksData.length;
      
      const createdTasks = await this.prisma.task.findMany({
        where: {
          orderIndex: {
            gte: startOrderIndex,
            lte: endOrderIndex,
          },
        },
        orderBy: {
          orderIndex: 'asc',
        },
      });

      return createdTasks as Task[];
    } catch (error) {
      throw new DatabaseError(`Failed to bulk create tasks: ${error}`);
    }
  }

  /**
   * Update an existing task
   */
  async update(id: string, data: UpdateTaskInput): Promise<Task> {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return task as Task;
    } catch (error) {
      throw new DatabaseError(`Failed to update task: ${error}`);
    }
  }

  /**
   * Delete a task
   */
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseError(`Failed to delete task: ${error}`);
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleComplete(id: string): Promise<Task> {
    try {
      const currentTask = await this.findById(id);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      const task = await this.prisma.task.update({
        where: { id },
        data: {
          completed: !currentTask.completed,
          completedAt: !currentTask.completed ? new Date() : null,
          updatedAt: new Date(),
        },
      });

      return task as Task;
    } catch (error) {
      throw new DatabaseError(`Failed to toggle task completion: ${error}`);
    }
  }

  /**
   * Get the maximum order index
   */
  async getMaxOrderIndex(): Promise<number> {
    try {
      const result = await this.prisma.task.aggregate({
        _max: {
          orderIndex: true,
        },
      });

      return result._max.orderIndex || 0;
    } catch (error) {
      throw new DatabaseError(`Failed to get max order index: ${error}`);
    }
  }

  /**
   * Reorder tasks by updating order values
   */
  async reorderTask(taskId: string, newOrderIndex: number): Promise<void> {
    try {
      await this.prisma.$transaction(async (prisma) => {
        // Get current task
        const currentTask = await prisma.task.findUnique({
          where: { id: taskId },
        });

        if (!currentTask) {
          throw new Error('Task not found');
        }

        const currentOrder = currentTask.orderIndex;

        if (newOrderIndex > currentOrder) {
          // Moving down - shift up tasks in between
          await prisma.task.updateMany({
            where: {
              orderIndex: {
                gt: currentOrder,
                lte: newOrderIndex,
              },
            },
            data: {
              orderIndex: {
                decrement: 1,
              },
            },
          });
        } else if (newOrderIndex < currentOrder) {
          // Moving up - shift down tasks in between
          await prisma.task.updateMany({
            where: {
              orderIndex: {
                gte: newOrderIndex,
                lt: currentOrder,
              },
            },
            data: {
              orderIndex: {
                increment: 1,
              },
            },
          });
        }

        // Update the target task's order
        await prisma.task.update({
          where: { id: taskId },
          data: {
            orderIndex: newOrderIndex,
            updatedAt: new Date(),
          },
        });
      });
    } catch (error) {
      throw new DatabaseError(`Failed to reorder task: ${error}`);
    }
  }

  /**
   * Get task statistics
   */
  async getStatistics(): Promise<{
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    byPriority: { priority: number; count: number }[];
  }> {
    try {
      const now = new Date();

      const [total, completed, pending, overdue, byPriority] = await Promise.all([
        this.prisma.task.count(),
        this.prisma.task.count({ where: { completed: true } }),
        this.prisma.task.count({ where: { completed: false } }),
        this.prisma.task.count({
          where: {
            completed: false,
            dueDate: { lt: now },
          },
        }),
        this.prisma.task.groupBy({
          by: ['priority'],
          _count: {
            priority: true,
          },
        }),
      ]);

      return {
        total,
        completed,
        pending,
        overdue,
        byPriority: byPriority.map((item: any) => ({
          priority: item.priority,
          count: item._count.priority,
        })),
      };
    } catch (error) {
      throw new DatabaseError(`Failed to get task statistics: ${error}`);
    }
  }

  /**
   * Cleanup - close Prisma connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 