import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TaskAPI } from '../services/api';
import type { 
  TaskQueryParams, 
  BulkDeleteRequest, 
  BulkCompleteRequest, 
  ReorderTaskRequest,
  ApiResponse
} from '../types/api';
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/modules/tasks/types/task.types';

/**
 * Query keys for React Query cache management
 */
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (params?: TaskQueryParams) => [...taskQueryKeys.lists(), params] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskQueryKeys.details(), id] as const,
  statistics: () => [...taskQueryKeys.all, 'statistics'] as const,
};

/**
 * Hook to fetch paginated tasks with filtering and sorting
 */
export function useTasks(params?: TaskQueryParams) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => TaskAPI.getTasks(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
  });
}

/**
 * Hook for infinite scrolling tasks with automatic pagination
 */
export function useInfiniteTasks(baseParams?: Omit<TaskQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: taskQueryKeys.list(baseParams),
    queryFn: ({ pageParam = 1 }) => {
      const params: TaskQueryParams = {
        ...baseParams,
        page: pageParam,
        limit: baseParams?.limit || 20,
      };
      return TaskAPI.getTasks(params);
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta?.hasMore) return undefined;
      return (lastPage.meta.page || 1) + 1;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    initialPageParam: 1,
  });
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: taskQueryKeys.detail(id),
    queryFn: () => TaskAPI.getTask(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch task statistics for dashboard
 */
export function useTaskStatistics() {
  return useQuery({
    queryKey: taskQueryKeys.statistics(),
    queryFn: () => TaskAPI.getTaskStatistics(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: CreateTaskInput) => TaskAPI.createTask(task),
    onSuccess: (response) => {
      // Invalidate and refetch task lists
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
      
      // Add the new task to cache if we have the data
      if (response.data) {
        queryClient.setQueryData(
          taskQueryKeys.detail(response.data.id),
          response
        );
      }
      
      // Show success toast
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task. Please try again.');
    },
  });
}

/**
 * Hook to update an existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: UpdateTaskInput }) => 
      TaskAPI.updateTask(id, task),
    onMutate: async ({ id, task }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.detail(id) });

      // Snapshot previous value
      const previousTask = queryClient.getQueryData<ApiResponse<Task>>(taskQueryKeys.detail(id));

      // Optimistically update the cache
      if (previousTask?.data) {
        queryClient.setQueryData(taskQueryKeys.detail(id), {
          ...previousTask,
          data: { ...previousTask.data, ...task, updatedAt: new Date() }
        });
      }

      return { previousTask };
    },
    onSuccess: () => {
      // Show success toast
      toast.success('Task updated successfully!');
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(taskQueryKeys.detail(id), context.previousTask);
      }
      console.error('Failed to update task:', error);
      toast.error('Failed to update task. Please try again.');
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskAPI.deleteTask(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });
      
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: taskQueryKeys.detail(id) });

      // Optimistically remove from list caches
      queryClient.setQueriesData(
        { queryKey: taskQueryKeys.lists() },
        (oldData: ApiResponse<Task[]> | undefined) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((task: Task) => task.id !== id),
            meta: oldData.meta ? { ...oldData.meta, total: oldData.meta.total - 1 } : undefined
          };
        }
      );
    },
    onSuccess: () => {
      // Show success toast
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      // Invalidate queries on error to refresh data
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task. Please try again.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
    },
  });
}

/**
 * Hook to toggle task completion status
 */
export function useToggleTaskComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskAPI.toggleTaskComplete(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.lists() });

      // Get the current task to determine new completion status
      let isCompleted = false;
      
      // Update infinite query caches
      queryClient.setQueriesData(
        { queryKey: taskQueryKeys.lists() },
        (oldData: InfiniteData<ApiResponse<Task[]>> | ApiResponse<Task[]> | undefined) => {
          if (!oldData) return oldData;
          
          // Handle infinite query structure
          if ('pages' in oldData) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: ApiResponse<Task[]>) => {
                if (!page.data) return page;
                return {
                  ...page,
                  data: page.data.map((task: Task) => {
                    if (task.id === id) {
                      isCompleted = !task.completed;
                      return {
                        ...task, 
                        completed: isCompleted,
                        completedAt: isCompleted ? new Date() : undefined,
                        updatedAt: new Date()
                      };
                    }
                    return task;
                  })
                };
              })
            };
          }
          
          // Handle regular query structure (fallback)
          if ('data' in oldData && oldData.data) {
            return {
              ...oldData,
              data: oldData.data.map((task: Task) => {
                if (task.id === id) {
                  isCompleted = !task.completed;
                  return {
                    ...task, 
                    completed: isCompleted,
                    completedAt: isCompleted ? new Date() : undefined,
                    updatedAt: new Date()
                  };
                }
                return task;
              })
            };
          }
          
          return oldData;
        }
      );

      return { isCompleted };
    },
    onSuccess: (response) => {
      // Show success toast based on completion status
      const task = response.data;
      if (task?.completed) {
        toast.success('Task marked as completed!');
      } else {
        toast.success('Task marked as pending!');
      }
    },
    onError: (error) => {
      // Invalidate queries on error to refresh data
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      console.error('Failed to toggle task completion:', error);
      toast.error('Failed to update task status. Please try again.');
    },
    onSettled: (data, error, id) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
    },
  });
}

/**
 * Hook to reorder tasks
 */
export function useReorderTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ReorderTaskRequest) => TaskAPI.reorderTask(request),
    onSuccess: () => {
      // Invalidate all task lists since order might affect multiple views
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to reorder task:', error);
    },
  });
}

/**
 * Hook for bulk delete operations
 */
export function useBulkDeleteTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkDeleteRequest) => TaskAPI.bulkDeleteTasks(request),
    onSuccess: (_, { taskIds }) => {
      // Remove deleted tasks from cache
      taskIds.forEach(id => {
        queryClient.removeQueries({ queryKey: taskQueryKeys.detail(id) });
      });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
      
      // Show success toast
      toast.success(`${taskIds.length} task${taskIds.length > 1 ? 's' : ''} deleted successfully!`);
    },
    onError: (error) => {
      console.error('Failed to bulk delete tasks:', error);
      toast.error('Failed to delete tasks. Please try again.');
    },
  });
}

/**
 * Hook for bulk completion toggle
 */
export function useBulkToggleComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkCompleteRequest) => TaskAPI.bulkToggleComplete(request),
    onSuccess: (_, { taskIds, completed }) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
      
      // Show success toast
      const action = completed ? 'completed' : 'marked as pending';
      toast.success(`${taskIds.length} task${taskIds.length > 1 ? 's' : ''} ${action}!`);
    },
    onError: (error) => {
      console.error('Failed to bulk toggle completion:', error);
      toast.error('Failed to update task status. Please try again.');
    },
  });
}

/**
 * Hook for bulk creating tasks
 */
export function useBulkCreateTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tasks: CreateTaskInput[]) => TaskAPI.bulkCreateTasks(tasks),
    onSuccess: (_, tasks) => {
      // Invalidate task lists and statistics to refetch with new data
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.statistics() });
      
      // Show success toast
      toast.success(`${tasks.length} task${tasks.length > 1 ? 's' : ''} created successfully!`);
    },
    onError: (error) => {
      console.error('Failed to bulk create tasks:', error);
      toast.error('Failed to create tasks. Please try again.');
    },
  });
} 