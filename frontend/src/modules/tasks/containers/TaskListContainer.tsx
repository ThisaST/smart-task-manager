import { useEffect, useCallback, useMemo, useState } from "react"
import { useTaskStore } from "@/store/taskStore"
import { TaskCreateModal } from "../components/TaskCreateModal"
import { TaskFilterBar } from "../components/TaskFilterBar"
import { DragDropTaskList } from "../components/DragDropTaskList"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit3, ChevronUp, ChevronDown, ChevronsUpDown, List, Grip } from "lucide-react"
import type { Task, FilterConfig, Priority } from "../types/task.types"
import { format, isToday, isPast } from 'date-fns'
import { useTaskOperations } from '../hooks/useTaskOperations'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { PriorityBadge } from '../components/PriorityBadge'
import { cn } from "@/utils/utils"

/**
 * TaskListContainer - Component that manages task list state and logic
 */

enum SortField {
  TITLE = 'title',
  PRIORITY = 'priority',
  DUE_DATE = 'dueDate',
  COMPLETED = 'completed'
}

type SortDirection = 'asc' | 'desc' | null

interface SortConfig {
  field: SortField
  direction: SortDirection
}

export function TaskListContainer() {
  const {
    tasks,
    isLoading,
    error,
    initializeSampleData,
  } = useTaskStore()
  const { deleteTask, toggleTaskComplete } = useTaskOperations()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'dragdrop'>('table')

  // Filter state
  const [filters, setFilters] = useState<FilterConfig>({
    status: 'all',
    priority: 'all',
    searchQuery: ''
  })

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: SortField.DUE_DATE,
    direction: 'asc'
  })

  // Initialize sample data on mount
  useEffect(() => {
    initializeSampleData()
  }, [initializeSampleData])

  // Handle task actions
  const handleToggleComplete = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      toggleTaskComplete(taskId, task.title, !task.completed)
    }
  }, [tasks, toggleTaskComplete])

  const handleDelete = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      deleteTask(taskId, task.title)
    }
  }, [tasks, deleteTask])

  const handleCreate = useCallback(() => {
    setSelectedTask(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedTask(undefined)
  }, [])

  // Handle sorting
  const handleSort = useCallback((field: SortField) => {
    setSortConfig(current => {
      if (current.field === field) {
        const nextDirection = 
          current.direction === 'asc' ? 'desc' :
          current.direction === 'desc' ? null : 'asc'
        return { field, direction: nextDirection }
      } else {
        return { field, direction: 'asc' }
      }
    })
  }, [])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field || !sortConfig.direction) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="ml-2 h-4 w-4" /> : 
      <ChevronDown className="ml-2 h-4 w-4" />
  }

  const SortableHeader = ({ field, children, className }: {
    field: SortField
    children: React.ReactNode
    className?: string
  }) => (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 p-0 font-semibold hover:bg-muted/50 text-foreground"
        onClick={() => handleSort(field)}
      >
        {children}
        <SortIcon field={field} />
      </Button>
    </TableHead>
  )

  const formatDueDate = useCallback((date: Date | string | null | undefined) => {
    if (!date) {
      return { text: 'No date', isOverdue: false, isToday: false }
    }
    
    const dateObj = date instanceof Date ? date : new Date(date)
    
    if (isNaN(dateObj.getTime())) {
      return { text: 'Invalid date', isOverdue: false, isToday: false }
    }
    
    if (isToday(dateObj)) {
      return { text: 'Today', isOverdue: false, isToday: true }
    } else if (isPast(dateObj)) {
      return { text: format(dateObj, 'MMM d, yyyy'), isOverdue: true, isToday: false }
    } else {
      return { text: format(dateObj, 'MMM d, yyyy'), isOverdue: false, isToday: false }
    }
  }, [])

  // Calculate task counts for filter bar
  const taskCounts = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    
    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<Priority, number>)

    return { total, completed, pending, byPriority }
  }, [tasks])

  // Apply filters to tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status === 'completed' && !task.completed) return false
      if (filters.status === 'pending' && task.completed) return false
      
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      
      return true
    })
  }, [tasks, filters])

  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks]

    // In drag-drop mode, always sort by order field
    if (viewMode === 'dragdrop') {
      sorted.sort((a, b) => a.order - b.order)
      return sorted
    }

    if (sortConfig.direction) {
      sorted.sort((a, b) => {
        let aValue: string | number | null
        let bValue: string | number | null

        switch (sortConfig.field) {
          case SortField.TITLE:
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case SortField.PRIORITY:
            aValue = a.priority
            bValue = b.priority
            break
          case SortField.DUE_DATE: {
            const aDate = a.dueDate ? (a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate)) : null
            const bDate = b.dueDate ? (b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate)) : null
            
            if (!aDate && !bDate) return 0
            if (!aDate) return 1
            if (!bDate) return -1
            
            aValue = aDate.getTime()
            bValue = bDate.getTime()
            break
          }
          case SortField.COMPLETED:
            aValue = a.completed ? 1 : 0
            bValue = b.completed ? 1 : 0
            break
          default:
            return 0
        }

        if (aValue === null && bValue === null) return 0
        if (aValue === null) return 1
        if (bValue === null) return -1

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    if (sortConfig.field !== SortField.COMPLETED) {
      sorted.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1
        }
        return 0
      })
    }

    return sorted
  }, [filteredTasks, sortConfig, viewMode])

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-destructive mb-4">
          <h3 className="text-lg font-semibold">Error loading tasks</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
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
          <p className="text-sm text-muted-foreground">
            {tasks.length === 0 
              ? "No tasks yet. Create your first task!" 
              : `${filteredTasks.filter(t => !t.completed).length} of ${filteredTasks.length} tasks pending`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {tasks.length > 0 && (
        <TaskFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
        />
      )}

      {/* Tasks Content */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            {tasks.length === 0 ? (
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
          tasks={sortedTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        // Responsive Task Display
        <>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {sortedTasks.map((task) => {
              const dueDateInfo = formatDueDate(task.dueDate)
              
              return (
                <div 
                  key={task.id} 
                  className={cn(
                    "bg-card border rounded-lg p-4 space-y-3 cursor-pointer hover:bg-muted/30 transition-colors",
                    task.completed && "opacity-60"
                  )}
                  onClick={() => handleEdit(task)}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 min-w-0 flex-1">
                      <div onClick={(e) => e.stopPropagation()} className="mt-0.5">
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={cn(
                          "font-medium text-sm",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(task)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Task Details */}
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={task.priority} />
                    <Badge 
                      variant={dueDateInfo.isOverdue ? "destructive" : dueDateInfo.isToday ? "default" : "outline"}
                      className={cn(
                        "text-xs",
                        !dueDateInfo.isOverdue && !dueDateInfo.isToday && "!bg-slate-200 !text-slate-800 !border-slate-300 dark:!bg-slate-600 dark:!text-slate-200 dark:!border-slate-500"
                      )}
                    >
                      {dueDateInfo.text}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-card border rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b-2">
                  <SortableHeader field={SortField.COMPLETED} className="w-12">
                    <span className="sr-only">Status</span>
                  </SortableHeader>
                  <SortableHeader field={SortField.TITLE}>
                    Task
                  </SortableHeader>
                  <SortableHeader field={SortField.PRIORITY} className="w-32">
                    Priority
                  </SortableHeader>
                  <SortableHeader field={SortField.DUE_DATE} className="w-32">
                    Due Date
                  </SortableHeader>
                  <TableHead className="w-20 text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.map((task) => {
                  const dueDateInfo = formatDueDate(task.dueDate)
                  
                  return (
                    <TableRow 
                      key={task.id} 
                      className={cn(
                        "cursor-pointer hover:bg-muted/30 transition-colors border-b",
                        task.completed && "opacity-60"
                      )}
                      onClick={() => handleEdit(task)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className={cn(
                            "font-medium",
                            task.completed && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-muted-foreground truncate max-w-md">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={task.priority} />
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={dueDateInfo.isOverdue ? "destructive" : dueDateInfo.isToday ? "default" : "outline"}
                          className={cn(
                            "font-medium",
                            !dueDateInfo.isOverdue && !dueDateInfo.isToday && "!bg-slate-200 !text-slate-800 !border-slate-300 dark:!bg-slate-600 dark:!text-slate-200 dark:!border-slate-500"
                          )}
                        >
                          {dueDateInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(task.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Single Modal for both Create and Edit */}
      <TaskCreateModal
        task={selectedTask}
        open={isModalOpen}
        onOpenChange={handleModalClose}
      />
    </div>
  )
} 