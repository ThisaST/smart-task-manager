import { useState, useCallback, useMemo } from "react"
import { TaskCreateModal } from "../components/TaskCreateModal"
import { TaskFilterBar } from "../components/TaskFilterBar"
import { DragDropTaskList } from "../components/DragDropTaskList"
import { TaskList } from "../components/TaskList"
import { TaskDataGenerator } from "../components/TaskDataGenerator"
import { Button } from "@/components/ui/button"
import { Plus, List, Grip, Database } from "lucide-react"
import type { FilterConfig, Priority, Task } from "../types/task.types"
import { 
  useInfiniteTasks, 
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask, 
  useToggleTaskComplete 
} from "@/shared/hooks/useTaskQueries"
import type { CreateTaskInput, UpdateTaskInput } from "../types/task.types"

/**
 * TaskListContainer - Component that manages task list state and API integration
 */

type ViewMode = 'table' | 'dragdrop';

export function TaskListContainer() {
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined)
  const [showDataGenerator, setShowDataGenerator] = useState(false)

  // Filter state
  const [filters, setFilters] = useState<FilterConfig>({
    status: 'all',
    priority: 'all',
    searchQuery: ''
  })

  // Build query parameters for infinite scrolling
  const queryParams = useMemo(() => ({
    limit: 20,
    status: filters.status,
    priority: filters.priority === 'all' ? ('all' as const) : Number(filters.priority),
    search: filters.searchQuery || undefined,
    sortBy: 'orderIndex' as const,
    sortOrder: 'asc' as const
  }), [filters])

  // API hooks with infinite scrolling
  const { 
    data,
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteTasks(queryParams)

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const toggleCompleteMutation = useToggleTaskComplete()

  // Extract and flatten tasks from infinite query pages
  const tasks = useMemo(() => {
    return data?.pages.flatMap(page => page.data).filter((task): task is Task => task !== undefined) || []
  }, [data])

  // Get meta from the first page (total count, etc.)
  const meta = data?.pages[0]?.meta

  // Get selected task for editing
  const selectedTask = selectedTaskId ? tasks.find((task: Task) => task.id === selectedTaskId) : undefined

  // Handle task actions
  const handleToggleComplete = useCallback((taskId: string) => {
    toggleCompleteMutation.mutate(taskId)
  }, [toggleCompleteMutation])

  const handleDelete = useCallback((taskId: string) => {
    deleteTaskMutation.mutate(taskId)
  }, [deleteTaskMutation])

  const handleCreate = useCallback(() => {
    setSelectedTaskId(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((task: Task) => {
    setSelectedTaskId(task.id)
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedTaskId(undefined)
  }, [])

  const handleTaskSubmit = useCallback((taskData: CreateTaskInput | UpdateTaskInput) => {
    if (selectedTask) {
      // Update existing task
      updateTaskMutation.mutate({
        id: selectedTask.id,
        task: taskData as UpdateTaskInput
      })
    } else {
      // Create new task
      createTaskMutation.mutate(taskData as CreateTaskInput)
    }
    handleModalClose()
  }, [selectedTask, updateTaskMutation, createTaskMutation, handleModalClose])

  // Calculate task counts for filter bar
  const taskCounts = useMemo(() => {
    const total = meta?.total || 0
    const completed = tasks.filter((task: Task) => task.completed).length
    const pending = total - completed
    
    const byPriority = tasks.reduce((acc: Record<Priority, number>, task: Task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<Priority, number>)

    return { total, completed, pending, byPriority }
  }, [tasks, meta])

  // Handle error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-destructive mb-4">
          <h3 className="text-lg font-semibold">Error loading tasks</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load tasks'}
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1 w-fit">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
              <span className="hidden sm:inline">Table</span>
            </Button>
            <Button
              variant={viewMode === 'dragdrop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('dragdrop')}
              className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <Grip className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
              <span className="hidden sm:inline">Drag & Drop</span>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {isLoading 
                ? "Loading tasks..." 
                : `${taskCounts.pending} of ${taskCounts.total} tasks pending`
              }
            </p>
            {isFetchingNextPage && (
              <span className="text-xs text-muted-foreground">Loading more...</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowDataGenerator(!showDataGenerator)}
            className="w-full sm:w-auto"
          >
            <Database className="w-4 h-4 mr-2" />
            Generate Data
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={createTaskMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            {createTaskMutation.isPending ? 'Creating...' : 'Add Task'}
          </Button>
        </div>
      </div>

      {/* Data Generator */}
      {showDataGenerator && (
        <TaskDataGenerator className="mb-4" />
      )}

      {/* Filter Bar */}
      {taskCounts.total > 0 && (
        <TaskFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
        />
      )}

      {/* Tasks Content */}
      {tasks.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            {taskCounts.total === 0 ? (
              <>
                <h3 className="text-lg font-semibold">No tasks yet</h3>
                <p className="text-sm">Create your first task to get started!</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">No tasks match your filters</h3>
                <p className="text-sm">Try adjusting your filters to see more tasks</p>
              </>
            )}
          </div>
        </div>
      ) : viewMode === 'dragdrop' ? (
        // Drag & Drop View
        <DragDropTaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error ? 'Failed to load tasks' : null}
        />
      ) : (
        // Virtualized Table View (Default)
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error ? 'Failed to load tasks' : null}
          onLoadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      {/* Task Modal */}
      <TaskCreateModal
        task={selectedTask}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSubmit={handleTaskSubmit}
        isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
      />
    </div>
  )
} 