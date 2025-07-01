/**
 * Dashboard Module Exports
 */

// Main containers
export { DashboardContainer } from './containers/DashboardContainer'
export { TaskListContainer } from './containers/TaskListContainer'

// Main components
export { TaskDashboard } from './components/TaskDashboard'

// Dashboard sub-components
export { OverviewCards } from './components/OverviewCards'
export { TaskStatusChart } from './components/TaskStatusChart'
export { PriorityChart } from './components/PriorityChart'
export { PriorityBreakdownDetails } from './components/PriorityBreakdownDetails'

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
export { PRIORITY_OPTIONS, TASK_FORM_CONSTANTS, TASK_FORM_DEFAULTS } from './constants/task.constants'
