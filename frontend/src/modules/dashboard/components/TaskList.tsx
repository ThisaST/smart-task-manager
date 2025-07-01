import { memo, useMemo, useRef } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { SortableHeader } from "./TaskTableHeader"
import { TaskTableRow } from "./TaskTableRow"
import { cn } from "@/utils/utils"
import type { Task } from "../types/task.types"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (taskId: string) => void
  onEdit: (task: Task) => void
  isLoading?: boolean
  error?: string | null
  className?: string
}

// Create column helper for type safety
const columnHelper = createColumnHelper<Task>()

/**
 * TaskList - Clean virtualized table component
 */
export const TaskList = memo<TaskListProps>(({
  tasks,
  onToggleComplete,
  onEdit,
  isLoading = false,
  error = null,
  className
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Define columns with proper typing
  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      size: 48,
      header: '',
      cell: () => null,
    }),
    columnHelper.accessor('title', {
      id: 'title',
      header: ({ column }) => (
        <SortableHeader column={column}>
          Task
        </SortableHeader>
      ),
      cell: () => null,
    }),
    columnHelper.accessor('priority', {
      id: 'priority',
      size: 96,
      header: ({ column }) => (
        <SortableHeader column={column}>
          Priority
        </SortableHeader>
      ),
      cell: () => null,
      sortingFn: (rowA, rowB) => rowA.original.priority - rowB.original.priority
    }),
    columnHelper.accessor('dueDate', {
      id: 'dueDate',
      size: 128,
      header: ({ column }) => (
        <SortableHeader column={column}>
          Due Date
        </SortableHeader>
      ),
      cell: () => null,
      sortingFn: (rowA, rowB) => {
        const dateA = rowA.original.dueDate ? new Date(rowA.original.dueDate).getTime() : 0
        const dateB = rowB.original.dueDate ? new Date(rowB.original.dueDate).getTime() : 0
        return dateA - dateB
      }
    })
  ], [])

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'dueDate', desc: false }]
    }
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 64,
    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">No tasks found</p>
          <p className="text-xs text-muted-foreground">Create your first task to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full border rounded-lg bg-card", className)}>
      {/* Table Header */}
      <div className="border-b">
        {table.getHeaderGroups().map(headerGroup => (
          <div key={headerGroup.id} className="flex">
            {headerGroup.headers.map(header => (
              <div
                key={header.id}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium text-muted-foreground bg-muted/30",
                  header.id === 'title' && "flex-1",
                  header.id === 'select' && "w-12",
                  header.id === 'priority' && "w-24",
                  header.id === 'dueDate' && "w-32"
                )}
              >
                {header.isPlaceholder ? null : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Virtualized Table Body */}
      <div 
        ref={tableContainerRef}
        className="relative overflow-auto"
        style={{ height: '600px' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => {
            const row = rows[virtualItem.index]
            const task = row.original

            return (
              <TaskTableRow
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})

TaskList.displayName = "TaskList" 