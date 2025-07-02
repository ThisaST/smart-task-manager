import { useCallback } from 'react'
import { 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask, 
  useToggleTaskComplete 
} from '@/shared/hooks/useTaskQueries'
import type { CreateTaskInput, UpdateTaskInput, Task } from '../types/task.types'

/**
 * Custom hook that provides task operations using React Query
 * Centralizes task CRUD operations and loading states
 */
export const useTaskOperations = () => {
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const toggleCompleteMutation = useToggleTaskComplete()

  const createTask = useCallback((task: CreateTaskInput) => {
    return createTaskMutation.mutate(task)
  }, [createTaskMutation])

  const updateTask = useCallback((task: Task) => {
    return updateTaskMutation.mutate({
      id: task.id,
      task: task as UpdateTaskInput
    })
  }, [updateTaskMutation])

  const deleteTask = useCallback((taskId: string) => {
    return deleteTaskMutation.mutate(taskId)
  }, [deleteTaskMutation])

  const toggleComplete = useCallback((taskId: string) => {
    return toggleCompleteMutation.mutate(taskId)
  }, [toggleCompleteMutation])

  return {
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    isLoading: createTaskMutation.isPending || 
               updateTaskMutation.isPending || 
               deleteTaskMutation.isPending || 
               toggleCompleteMutation.isPending,
    error: createTaskMutation.error || 
           updateTaskMutation.error || 
           deleteTaskMutation.error || 
           toggleCompleteMutation.error
  }
} 