import { memo, useCallback } from "react";
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "./PriorityBadge";
import { cn } from "@/utils/utils";
import { format, isToday, isPast } from 'date-fns';
import type { Task } from "../types/task.types";

interface SortableTaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isSelected?: boolean;
  onSelect?: (taskId: string) => void;
  className?: string;
}

/**
 * SortableTaskItem - A draggable task item component
 * Uses @dnd-kit/sortable for drag-and-drop functionality
 */
export const SortableTaskItem = memo<SortableTaskItemProps>(({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(task.id);
  }, [onToggleComplete, task.id]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(task.id);
  }, [onDelete, task.id]);

  const handleSelect = useCallback(() => {
    onSelect?.(task.id);
  }, [onSelect, task.id]);

  const formatDueDate = useCallback((date: Date | string | null | undefined) => {
    if (!date) {
      return { text: 'No date', isOverdue: false, isToday: false };
    }
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return { text: 'Invalid date', isOverdue: false, isToday: false };
    }
    
    if (isToday(dateObj)) {
      return { text: 'Today', isOverdue: false, isToday: true };
    } else if (isPast(dateObj)) {
      return { text: format(dateObj, 'MMM d, yyyy'), isOverdue: true, isToday: false };
    } else {
      return { text: format(dateObj, 'MMM d, yyyy'), isOverdue: false, isToday: false };
    }
  }, []);

  const dueDateInfo = formatDueDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border rounded-lg p-4 transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        isDragging && "opacity-50 shadow-lg scale-105 rotate-1",
        task.completed && "opacity-60",
        isSelected && "ring-2 ring-primary",
        className
      )}
      onClick={handleSelect}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "flex items-center justify-center w-6 h-6 text-muted-foreground",
            "hover:text-foreground cursor-grab active:cursor-grabbing",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
            isDragging && "cursor-grabbing"
          )}
          aria-label="Drag to reorder task"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Checkbox */}
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-sm leading-tight",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Priority and Due Date */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <PriorityBadge priority={task.priority} />
              <Badge 
                variant={dueDateInfo.isOverdue ? "destructive" : dueDateInfo.isToday ? "default" : "outline"}
                className={cn(
                  "text-xs font-medium",
                  !dueDateInfo.isOverdue && !dueDateInfo.isToday && 
                  "!bg-slate-200 !text-slate-800 !border-slate-300 dark:!bg-slate-600 dark:!text-slate-200 dark:!border-slate-500"
                )}
              >
                {dueDateInfo.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            aria-label={`Edit task "${task.title}"`}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              aria-label={`Delete task "${task.title}"`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}); 