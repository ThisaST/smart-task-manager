import { z } from 'zod';
import { isFuture } from 'date-fns';
import { Priority } from '../types/task.types';
import { TASK_FORM_CONSTANTS } from '../constants/task.constants';

/**
 * Zod schema for Priority enum validation
 */
const PrioritySchema = z.nativeEnum(Priority);

/**
 * Task form validation schema with comprehensive validation rules
 */
export const TaskFormSchema = z.object({
  title: z.string()
    .min(TASK_FORM_CONSTANTS.MIN_TITLE_LENGTH, "Title is required")
    .max(TASK_FORM_CONSTANTS.MAX_TITLE_LENGTH, "Title must be less than 100 characters")
    .regex(/^[^<>]*$/, "Title contains invalid characters"),
  
  description: z.string()
    .max(TASK_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  
  dueDate: z.date({
    required_error: "Due date is required",
    invalid_type_error: "Please select a valid date"
  }).refine(
    (date) => isFuture(date),
    { message: "Due date must be in the future" }
  ),
  
  priority: PrioritySchema,
});

/**
 * Task edit validation schema (allows past dates for editing existing tasks)
 */
export const TaskEditSchema = z.object({
  title: z.string()
    .min(TASK_FORM_CONSTANTS.MIN_TITLE_LENGTH, "Title is required")
    .max(TASK_FORM_CONSTANTS.MAX_TITLE_LENGTH, "Title must be less than 100 characters")
    .regex(/^[^<>]*$/, "Title contains invalid characters"),
  
  description: z.string()
    .max(TASK_FORM_CONSTANTS.MAX_DESCRIPTION_LENGTH, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  
  dueDate: z.date({
    required_error: "Due date is required",
    invalid_type_error: "Please select a valid date"
  }),
  
  priority: PrioritySchema,
});

/**
 * TypeScript type for the form data
 */
export type TaskFormData = z.infer<typeof TaskFormSchema>;

/**
 * TypeScript type for the edit form data
 */
export type TaskEditData = z.infer<typeof TaskEditSchema>;

// Re-export constants for backward compatibility
export { PRIORITY_OPTIONS as PriorityOptions, TASK_FORM_DEFAULTS as TaskFormDefaults } from '../constants/task.constants';

/**
 * Validation utility function
 */
export const validateTaskForm = (data: unknown) => {
  const result = TaskFormSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path.join('.');
      acc[field] = issue.message;
      return acc;
    }, {} as Record<string, string>);
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
};

/**
 * Validation utility function for edit form
 */
export const validateTaskEditForm = (data: unknown) => {
  const result = TaskEditSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path.join('.');
      acc[field] = issue.message;
      return acc;
    }, {} as Record<string, string>);
    return { success: false, errors };
  }
  
  return { success: true, data: result.data };
}; 