import { useCallback } from 'react'
import { toast } from 'sonner'
import { useTaskStore } from '@/store/taskStore'
import type { CreateTaskInput, Task } from '../types/task.types'

/**
 * Custom hook for task operations with toast notifications
 * Provides convenient methods for CRUD operations with user feedback
 */
export const useTaskOperations = () => {
  const {
    addTask: addTaskToStore,
    updateTask: updateTaskInStore,
    deleteTask: deleteTaskFromStore,
    toggleTaskComplete: toggleTaskCompleteInStore,
    setLoading,
    setError,
  } = useTaskStore()

  const addTask = useCallback(async (taskInput: CreateTaskInput) => {
    try {
      setLoading(true)
      setError(null)
      
      // Add task to store
      addTaskToStore(taskInput)
      
      // Show success toast
      toast.success("Task created successfully!", {
        description: `"${taskInput.title}" has been added to your tasks.`,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task'
      setError(errorMessage)
      
      toast.error("Failed to create task", {
        description: errorMessage,
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [addTaskToStore, setLoading, setError])

  const updateTask = useCallback(async (task: Task) => {
    try {
      setLoading(true)
      setError(null)
      
      // Update task in store
      updateTaskInStore(task)
      
      // Show success toast
      toast.success("Task updated successfully!", {
        description: `"${task.title}" has been updated.`,
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task'
      setError(errorMessage)
      
      toast.error("Failed to update task", {
        description: errorMessage,
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [updateTaskInStore, setLoading, setError])

  const deleteTask = useCallback(async (taskId: string, taskTitle?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // Delete task from store
      deleteTaskFromStore(taskId)
      
      // Show success toast with undo option
      toast.success("Task deleted", {
        description: taskTitle ? `"${taskTitle}" has been deleted.` : "Task has been deleted.",
        action: {
          label: "Undo",
          onClick: () => {
            // Note: In a real app, you'd implement proper undo functionality
            toast.info("Undo functionality coming soon!", {
              description: "This would restore the deleted task.",
            })
          },
        },
      })
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task'
      setError(errorMessage)
      
      toast.error("Failed to delete task", {
        description: errorMessage,
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [deleteTaskFromStore, setLoading, setError])

  const toggleTaskComplete = useCallback(async (taskId: string, taskTitle?: string, isCompleted?: boolean) => {
    try {
      // Toggle task completion in store
      toggleTaskCompleteInStore(taskId)
      
      // Show appropriate toast based on the new state
      if (isCompleted) {
        toast.success("Task completed! 🎉", {
          description: taskTitle ? `"${taskTitle}" marked as complete.` : "Task marked as complete.",
        })
      } else {
        toast.info("Task reopened", {
          description: taskTitle ? `"${taskTitle}" marked as incomplete.` : "Task marked as incomplete.",
        })
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task'
      
      toast.error("Failed to update task", {
        description: errorMessage,
      })
      
      throw error
    }
  }, [toggleTaskCompleteInStore])

  return {
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  }
} 