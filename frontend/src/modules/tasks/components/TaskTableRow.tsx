import { memo, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PriorityBadge } from "./PriorityBadge"
import { Calendar, Edit3, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/utils/utils"
import type { Task } from "../types/task.types"

interface TaskTableRowProps {
  task: Task
  style?: React.CSSProperties
  onToggleComplete: (taskId: string) => void
  onEdit: (task: Task) => void
  onDelete?: (taskId: string) => void
  className?: string
}

export const TaskTableRow = memo<TaskTableRowProps>(({ 
  task, 
  style, 
  onToggleComplete, 
  onEdit,
  onDelete,
  className
}) => {
  const handleRowClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger edit when clicking checkbox or action buttons
    const target = e.target as HTMLElement
    if (target.closest('.checkbox-container') || target.closest('button') || target.closest('input[type="checkbox"]')) {
      return
    }
    onEdit(task)
  }, [onEdit, task])

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onToggleComplete(task.id)
  }, [onToggleComplete, task.id])

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(task)
  }, [onEdit, task])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(task.id)
    }
  }, [onDelete, task.id])

  return (
    <div
      style={style}
      className={cn("relative bg-background", className)}
    >
      <div 
        className="flex items-center w-full h-16 px-4 py-3 hover:bg-muted/50 transition-colors border-b group cursor-pointer"
        onClick={handleRowClick}
      >        
        {/* Checkbox */}
        <div className="flex items-center justify-center w-12 checkbox-container">
          <Checkbox
            checked={task.completed}
            onChange={handleCheckboxChange}
            aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          />
        </div>
        
        {/* Title */}
        <div className="flex-1 min-w-0 px-4">
          <div className={cn(
            "font-medium truncate text-sm",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </div>
        </div>
        
        {/* Priority */}
        <div className="w-24 px-2">
          <PriorityBadge priority={task.priority} />
        </div>
        
        {/* Due Date */}
        <div className="w-32 px-2">
          {task.dueDate ? (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className={cn(
                "truncate text-xs",
                new Date(task.dueDate) < new Date() && !task.completed && "text-destructive"
              )}>
                {format(new Date(task.dueDate), "MMM dd, yyyy")}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">No due date</span>
          )}
        </div>

        {/* Actions */}
        <div className="w-20 px-2">
          <div className="flex items-center justify-end gap-1 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              aria-label={`Edit task ${task.title}`}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                aria-label={`Delete task ${task.title}`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

TaskTableRow.displayName = "TaskTableRow" 