import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Task, CreateTaskInput, FilterConfig } from '../modules/dashboard/types/task.types'
import { Priority } from '../modules/dashboard/types/task.types'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  filters: FilterConfig
  isTestDataActive: boolean
}

interface TaskActions {
        
  addTask: (task: CreateTaskInput) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  toggleTaskComplete: (taskId: string) => void
  reorderTasks: (dragIndex: number, hoverIndex: number) => void
  
  // Filters
  setFilters: (filters: Partial<FilterConfig>) => void
  
  // State management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Initialization
  initializeSampleData: () => void
  generateLargeDataset: (count: number) => void
  clearTestData: () => void
}

type TaskStore = TaskState & TaskActions

// Sample task data for development
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Implement authentication system',
    description: 'Set up user authentication with JWT tokens and secure password hashing',
    priority: Priority.HIGH,
    completed: false,
    dueDate: new Date('2024-12-28'),
    createdDate: new Date('2024-12-15'),
    modifiedDate: new Date('2024-12-15'),
    order: 0,
  },
  {
    id: '2', 
    title: 'Design user dashboard',
    description: 'Create wireframes and mockups for the main user dashboard',
    priority: Priority.MEDIUM,
    completed: true,
    dueDate: new Date('2024-12-23'),
    createdDate: new Date('2024-12-10'),
    modifiedDate: new Date('2024-12-18'),
    order: 1,
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples and response schemas',
    priority: Priority.LOW,
    completed: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdDate: new Date('2024-12-12'),
    modifiedDate: new Date('2024-12-12'),
    order: 2,
  },
  {
    id: '4',
    title: 'Optimize database queries',
    description: 'Review and optimize slow database queries for better performance',
    priority: Priority.HIGH,
    completed: false,
    dueDate: new Date('2025-01-15'),
    createdDate: new Date('2024-12-14'),
    modifiedDate: new Date('2024-12-14'),
    order: 3,
  },
  {
    id: '5',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment workflow',
    priority: Priority.MEDIUM,
    completed: false,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdDate: new Date('2024-12-13'),
    modifiedDate: new Date('2024-12-13'),
    order: 4,
  },
  {
    id: '6',
    title: 'Implement user registration',
    description: 'Create user registration flow with email verification',
    priority: Priority.HIGH,
    completed: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdDate: new Date('2024-12-14'),
    modifiedDate: new Date('2024-12-14'),
    order: 5,
  },
  {
    id: '7',
    title: 'Create landing page',
    description: 'Design and implement responsive landing page',
    priority: Priority.MEDIUM,
    completed: false,
    dueDate: new Date(),
    createdDate: new Date('2024-12-11'),
    modifiedDate: new Date('2024-12-11'),
    order: 6,
  },
  {
    id: '8',
    title: 'Set up monitoring',
    description: 'Configure application monitoring and alerting',
    priority: Priority.LOW,
    completed: true,
    dueDate: new Date('2024-12-22'),
    createdDate: new Date('2024-12-09'),
    modifiedDate: new Date('2024-12-16'),
    order: 7,
  },
  {
    id: '9',
    title: 'Implement search functionality',
    description: 'Add search capabilities to the application',
    priority: Priority.MEDIUM,
    completed: false,
    dueDate: new Date('2024-12-29'),
    createdDate: new Date('2024-12-13'),
    modifiedDate: new Date('2024-12-13'),
    order: 8,
  },
  {
    id: '10',
    title: 'Write unit tests',
    description: 'Create comprehensive unit test suite',
    priority: Priority.HIGH,
    completed: false,
    dueDate: new Date('2025-01-10'),
    createdDate: new Date('2024-12-12'),
    modifiedDate: new Date('2024-12-12'),
    order: 9,
  },
  {
    id: '11',
    title: 'Implement file upload',
    description: 'Add file upload functionality with validation',
    priority: Priority.MEDIUM,
    completed: false,
    dueDate: new Date('2024-12-31'),
    createdDate: new Date('2024-12-10'),
    modifiedDate: new Date('2024-12-10'),
    order: 10,
  },
  {
    id: '12',
    title: 'Create admin dashboard',
    description: 'Build admin interface for system management',
    priority: Priority.LOW,
    completed: false,
    dueDate: new Date('2025-01-05'),
    createdDate: new Date('2024-12-08'),
    modifiedDate: new Date('2024-12-08'),
    order: 11,
  },
  {
    id: '13',
    title: 'Implement notifications',
    description: 'Add push notifications and email alerts',
    priority: Priority.MEDIUM,
    completed: true,
    dueDate: new Date('2024-12-24'),
    createdDate: new Date('2024-12-07'),
    modifiedDate: new Date('2024-12-15'),
    order: 12,
  },
  {
    id: '14',
    title: 'Security audit',
    description: 'Conduct comprehensive security review',
    priority: Priority.HIGH,
    completed: false,
    dueDate: new Date('2024-12-26'),
    createdDate: new Date('2024-12-06'),
    modifiedDate: new Date('2024-12-06'),
    order: 13,
  },
  {
    id: '15',
    title: 'Performance optimization',
    description: 'Optimize application performance and loading times',
    priority: Priority.MEDIUM,
    completed: false,
    dueDate: new Date('2025-01-08'),
    createdDate: new Date('2024-12-05'),
    modifiedDate: new Date('2024-12-05'),
    order: 14,
  },
  {
    id: '16',
    title: 'Mobile app prototype',
    description: 'Create mobile application prototype',
    priority: Priority.LOW,
    completed: false,
    dueDate: new Date('2025-01-15'),
    createdDate: new Date('2024-12-04'),
    modifiedDate: new Date('2024-12-04'),
    order: 15,
  },
  {
    id: '17',
    title: 'Data backup system',
    description: 'Implement automated data backup and recovery',
    priority: Priority.HIGH,
    completed: false,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdDate: new Date('2024-12-03'),
    modifiedDate: new Date('2024-12-03'),
    order: 16,
  },
  {
    id: '18',
    title: 'User analytics',
    description: 'Set up user behavior tracking and analytics',
    priority: Priority.MEDIUM,
    completed: true,
    dueDate: new Date('2024-12-21'),
    createdDate: new Date('2024-12-02'),
    modifiedDate: new Date('2024-12-14'),
    order: 17,
  },
  {
    id: '19',
    title: 'API rate limiting',
    description: 'Implement API rate limiting and throttling',
    priority: Priority.MEDIUM,
    completed: false,
    dueDate: new Date('2024-12-30'),
    createdDate: new Date('2024-12-01'),
    modifiedDate: new Date('2024-12-01'),
    order: 18,
  },
  {
    id: '20',
    title: 'Deployment automation',
    description: 'Automate deployment process with Docker and Kubernetes',
    priority: Priority.LOW,
    completed: false,
    dueDate: new Date('2025-01-12'),
    createdDate: new Date('2024-11-30'),
    modifiedDate: new Date('2024-11-30'),
    order: 19,
  }
]

export const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        tasks: [],
        isLoading: false,
        error: null,
        filters: {
          status: 'all',
          priority: 'all',
          searchQuery: '',
        },
        isTestDataActive: false,

        // Task CRUD actions
        addTask: (taskInput) => set((state) => {
          const newTask: Task = {
            id: Date.now().toString(),
            ...taskInput,
            completed: false,
            createdDate: new Date(),
            modifiedDate: new Date(),
            order: state.tasks.length,
          }
          state.tasks.push(newTask)
        }),

        updateTask: (updatedTask) => set((state) => {
          const index = state.tasks.findIndex(t => t.id === updatedTask.id)
          if (index !== -1) {
            state.tasks[index] = {
              ...updatedTask,
              modifiedDate: new Date(),
            }
          }
        }),

        deleteTask: (taskId) => set((state) => {
          const index = state.tasks.findIndex(task => task.id === taskId)
          if (index !== -1) {
            state.tasks.splice(index, 1)
          }
        }),

        toggleTaskComplete: (taskId) => set((state) => {
          const task = state.tasks.find(t => t.id === taskId)
          if (task) {
            task.completed = !task.completed
            task.modifiedDate = new Date()
          }
        }),

        // Filter actions
        setFilters: (newFilters) => set((state) => {
          state.filters = { ...state.filters, ...newFilters }
        }),

        // State management
        setLoading: (loading) => set((state) => {
          state.isLoading = loading
        }),

        setError: (error) => set((state) => {
          state.error = error
        }),

        // Initialize sample data
        initializeSampleData: () => set((state) => {
          if (state.tasks.length === 0) {
            state.tasks = sampleTasks
          }
        }),

        // Generate large dataset for testing virtualization
        // NOTE: Test data is NOT persisted to localStorage to avoid performance issues
        generateLargeDataset: (count: number) => set((state) => {
          const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH]
          const titles = [
            'Implement authentication system', 'Design user dashboard', 'Write API documentation',
            'Optimize database queries', 'Setup CI/CD pipeline', 'Create landing page',
            'Set up monitoring', 'Implement search functionality', 'Write unit tests',
            'Implement file upload', 'Create admin dashboard', 'Implement notifications',
            'Security audit', 'Performance optimization', 'Mobile app prototype',
            'Data backup system', 'User analytics', 'API rate limiting',
            'Deployment automation', 'Code review process'
          ]
          
          const tasks = Array.from({ length: count }, (_, i) => ({
            id: `generated-${i}`,
            title: `${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`,
            description: `Auto-generated task ${i + 1} for testing virtualization performance`,
            priority: priorities[i % priorities.length],
            completed: Math.random() > 0.7,
            dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            modifiedDate: new Date(),
            order: i,
          }))
          
          state.tasks = tasks
          state.isTestDataActive = true // Mark as test data
        }),

        clearTestData: () => set((state) => {
          state.tasks = []
          state.isTestDataActive = false
        }),

        reorderTasks: (dragIndex: number, hoverIndex: number) => set((state) => {
          const tasks = state.tasks
          const [draggedTask] = tasks.splice(dragIndex, 1)
          tasks.splice(hoverIndex, 0, draggedTask)
          
          // Update the order property for all tasks to reflect new positions
          tasks.forEach((task, index) => {
            task.order = index
          })
          
          state.tasks = tasks
        }),
      })),
      {
        name: 'task-store',
        // Smart persistence: Only store real user data, not test data
        partialize: (state) => {
          // Don't persist test data to avoid localStorage performance issues
          if (state.isTestDataActive) {
            return {
              tasks: [], // Don't store test data
              filters: state.filters,
              isTestDataActive: false, // Reset flag on reload
            }
          }
          
          // For real user data, limit to reasonable number to prevent localStorage bloat
          const MAX_PERSISTED_TASKS = 1000
          const tasksToStore = state.tasks.length > MAX_PERSISTED_TASKS 
            ? state.tasks.slice(-MAX_PERSISTED_TASKS) // Keep most recent tasks
            : state.tasks
          
          return {
            tasks: tasksToStore,
            filters: state.filters,
            isTestDataActive: state.isTestDataActive,
          }
        },
      }
    ),
    { name: 'TaskStore' }
  )
) 