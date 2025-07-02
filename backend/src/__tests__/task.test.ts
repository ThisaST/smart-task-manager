import request from 'supertest';
import { Priority } from '../types/task.types';
import app from '../app';
import { prisma } from './setup';

describe('Task API', () => {
  const testApp = app.getApp();

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: Priority.MEDIUM,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      const response = await request(testApp)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        completed: false,
      });
      expect(response.body.data.id).toBeDefined();
    });

    it('should validate required fields', async () => {
      const response = await request(testApp)
        .post('/api/tasks')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should enforce high priority tasks must have due date', async () => {
      const taskData = {
        title: 'High Priority Task',
        priority: Priority.HIGH,
      };

      const response = await request(testApp)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('High priority tasks must have a due date');
    });
  });

  describe('GET /api/tasks', () => {
    it('should retrieve all tasks with pagination', async () => {
      // Create test tasks
      await prisma.task.createMany({
        data: [
          {
            title: 'Task 1',
            priority: Priority.LOW,
            orderIndex: 1,
          },
          {
            title: 'Task 2',
            priority: Priority.HIGH,
            dueDate: new Date(Date.now() + 86400000),
            orderIndex: 2,
          },
        ],
      });

      const response = await request(testApp)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta).toMatchObject({
        total: 2,
        page: 1,
        limit: 20,
        hasMore: false,
        totalPages: 1,
      });
    });

    it('should filter tasks by status', async () => {
      // Create test tasks
      await prisma.task.createMany({
        data: [
          {
            title: 'Completed Task',
            priority: Priority.LOW,
            completed: true,
            completedAt: new Date(),
            orderIndex: 1,
          },
          {
            title: 'Pending Task',
            priority: Priority.MEDIUM,
            completed: false,
            orderIndex: 2,
          },
        ],
      });

      const response = await request(testApp)
        .get('/api/tasks?status=completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should retrieve a specific task', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Specific Task',
          priority: Priority.MEDIUM,
          orderIndex: 1,
        },
      });

      const response = await request(testApp)
        .get(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(task.id);
      expect(response.body.data.title).toBe('Specific Task');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      
      const response = await request(testApp)
        .get(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Task not found');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion status', async () => {
      const task = await prisma.task.create({
        data: {
          title: 'Toggle Task',
          priority: Priority.LOW,
          completed: false,
          orderIndex: 1,
        },
      });

      const response = await request(testApp)
        .patch(`/api/tasks/${task.id}/complete`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
      expect(response.body.data.completedAt).toBeDefined();
    });
  });

  describe('GET /api/tasks/statistics', () => {
    it('should return task statistics', async () => {
      await prisma.task.createMany({
        data: [
          {
            title: 'High Priority',
            priority: Priority.HIGH,
            dueDate: new Date(Date.now() + 86400000),
            completed: false,
            orderIndex: 1,
          },
          {
            title: 'Completed Task',
            priority: Priority.LOW,
            completed: true,
            completedAt: new Date(),
            orderIndex: 2,
          },
          {
            title: 'Overdue Task',
            priority: Priority.MEDIUM,
            dueDate: new Date(Date.now() - 86400000), // Yesterday
            completed: false,
            orderIndex: 3,
          },
        ],
      });

      const response = await request(testApp)
        .get('/api/tasks/statistics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        total: 3,
        completed: 1,
        pending: 2,
        overdue: 1,
        completionRate: 33.33,
      });
      expect(response.body.data.byPriority).toHaveLength(3);
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app.getApp())
      .get('/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Server is healthy');
  });
}); 