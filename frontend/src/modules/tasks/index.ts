/**
 * Tasks Module
 * 
 * This module handles all task management functionality including:
 * - Task creation, editing, and deletion
 * - Task filtering and sorting
 * - Drag and drop functionality
 * - Task list display and management
 */

// Main container
export { TaskListContainer } from './containers/TaskListContainer'

// Task management components
export { TaskList } from './components/TaskList'
export { TaskCreateForm } from './components/TaskCreateForm'
export { TaskCreateModal } from './components/TaskCreateModal'
export { TaskFilterBar } from './components/TaskFilterBar'
export { SortableHeader } from './components/TaskTableHeader'
export { TaskTableRow } from './components/TaskTableRow'
export { PriorityBadge } from './components/PriorityBadge'

// Drag and Drop components
export { DragDropTaskList } from './components/DragDropTaskList'
export { SortableTaskItem } from './components/SortableTaskItem'

// Hooks
export { useDragAndDrop } from './hooks/useDragAndDrop'
export { useTaskOperations } from './hooks/useTaskOperations'

// Types
export type { Task, CreateTaskInput, UpdateTaskInput, FilterConfig, TaskStatus, PriorityFilter } from './types/task.types'
export { Priority } from './types/task.types'

// Schemas
export { TaskFormSchema, TaskEditSchema, type TaskFormData, type TaskEditData } from './schemas/task-form.schemas'

// Constants
export * from './constants/task.constants' 