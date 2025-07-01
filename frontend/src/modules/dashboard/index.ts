/**
 * Dashboard Module Exports
 */

export { TaskListContainer } from './containers/TaskListContainer'

export { TaskList } from './components/TaskList'
export { TaskCreateForm } from './components/TaskCreateForm'
export { TaskCreateModal } from './components/TaskCreateModal'
export { TaskTableRow } from './components/TaskTableRow'
export { PriorityBadge } from './components/PriorityBadge'

// Types
export type { Task, CreateTaskInput, UpdateTaskInput, FilterConfig, TaskItemProps, TaskListProps } from './types/task.types'

// Schemas
export { TaskFormSchema, TaskEditSchema, type TaskFormData, type TaskEditData } from './schemas/task-form.schemas'

// Hooks
export { useTaskOperations } from './hooks/useTaskOperations'

// Constants
export { PRIORITY_OPTIONS, TASK_FORM_CONSTANTS, TASK_FORM_DEFAULTS } from './constants/task.constants'
