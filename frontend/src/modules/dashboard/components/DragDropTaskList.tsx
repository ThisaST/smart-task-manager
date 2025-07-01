import { memo } from "react";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { SortableTaskItem } from "./SortableTaskItem";
import { cn } from "@/utils/utils";
import type { Task } from "../types/task.types";

interface DragDropTaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onSelect?: (taskId: string) => void;
  selectedTasks?: string[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * DragDropTaskList - A draggable task list component
 * Provides drag-and-drop functionality for task reordering
 */
export const DragDropTaskList = memo<DragDropTaskListProps>(({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onSelect,
  selectedTasks = [],
  isLoading = false,
  error = null,
  className
}) => {
  const { DragDropProvider } = useDragAndDrop(tasks);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">No tasks found</p>
          <p className="text-xs text-muted-foreground">Create your first task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <DragDropProvider>
      <div className={cn("space-y-3 p-1", className)}>
        {tasks.map((task) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onSelect={onSelect}
            isSelected={selectedTasks.includes(task.id)}
            className="group"
          />
        ))}
      </div>
    </DragDropProvider>
  );
}); 