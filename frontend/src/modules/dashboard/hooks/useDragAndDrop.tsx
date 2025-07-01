import { useCallback } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Task } from '../types/task.types';

/**
 * Custom hook for drag and drop functionality using @dnd-kit
 * Provides sensors, context, and handlers for task reordering
 */
export const useDragAndDrop = (displayedTasks: Task[]) => {
  const { tasks: allTasks, reorderTasks } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      // Find the indices in the displayed tasks array (what user sees)
      const displayedOldIndex = displayedTasks.findIndex(task => task.id === active.id);
      const displayedNewIndex = displayedTasks.findIndex(task => task.id === over.id);
      
      if (displayedOldIndex !== -1 && displayedNewIndex !== -1) {
        // Find the corresponding indices in the full tasks array
        const fullOldIndex = allTasks.findIndex(task => task.id === active.id);
        const fullNewIndex = allTasks.findIndex(task => task.id === over.id);
        
        if (fullOldIndex !== -1 && fullNewIndex !== -1) {
          reorderTasks(fullOldIndex, fullNewIndex);
        }
      }
    }
  }, [displayedTasks, allTasks, reorderTasks]);

  const DragDropProvider = useCallback(({ children }: { children: React.ReactNode }) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={displayedTasks.map(t => t.id)} 
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  ), [sensors, handleDragEnd, displayedTasks]);

  return {
    DragDropProvider,
    sensors,
    handleDragEnd,
    taskIds: displayedTasks.map(t => t.id),
  };
}; 