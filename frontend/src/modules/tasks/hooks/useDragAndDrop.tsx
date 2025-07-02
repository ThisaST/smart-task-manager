import { useState, useCallback } from 'react';
import type { Task } from '../types/task.types';

interface UseDragAndDropProps {
  tasks: Task[];
  onReorderTasks?: (dragIndex: number, hoverIndex: number) => void;
}

export function useDragAndDrop({ tasks, onReorderTasks }: UseDragAndDropProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = useCallback((task: Task) => {
    setDraggedTask(task);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
  }, []);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    onReorderTasks?.(dragIndex, hoverIndex);
  }, [onReorderTasks]);

  return {
    draggedTask,
    handleDragStart,
    handleDragEnd,
    moveTask,
    allTasks: tasks,
  };
} 