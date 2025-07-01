import { Priority } from '../types/task.types';

/**
 * Priority options for UI components with theme-aware colors
 */
export const PRIORITY_OPTIONS = [
  { 
    value: Priority.LOW, 
    label: "Low", 
    color: "bg-priority-low", 
    textColor: "text-priority-low",
    borderColor: "border-priority-low"
  },
  { 
    value: Priority.MEDIUM, 
    label: "Medium", 
    color: "bg-priority-medium", 
    textColor: "text-priority-medium",
    borderColor: "border-priority-medium"
  },
  { 
    value: Priority.HIGH, 
    label: "High", 
    color: "bg-priority-high", 
    textColor: "text-priority-high",
    borderColor: "border-priority-high"
  },
] as const;

/**
 * Task form constants
 */
export const TASK_FORM_CONSTANTS = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_TITLE_LENGTH: 1,
} as const;

/**
 * Default form values
 */
export const TASK_FORM_DEFAULTS = {
  title: "",
  description: "",
  dueDate: undefined,
  priority: Priority.MEDIUM,
} as const; 