import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/utils"
import { Priority } from "../types/task.types"
import type { CreateTaskInput, UpdateTaskInput, Task } from "../types/task.types"
import { TaskFormSchema, type TaskFormData, PriorityOptions, TaskFormDefaults } from "../schemas/task-form.schemas"

interface TaskCreateFormProps {
  task?: Task
  onCancel: () => void
  onSuccess?: () => void
  onSubmit?: (taskData: CreateTaskInput | UpdateTaskInput) => void
  isSubmitting?: boolean
}

export function TaskCreateForm({ 
  task, 
  onCancel, 
  onSuccess, 
  onSubmit,
  isSubmitting: externalIsSubmitting = false
}: TaskCreateFormProps) {
  const isEditMode = !!task
  
  // Use TaskFormData for both create and edit modes
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting: formIsSubmitting },
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: isEditMode ? {
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      priority: task.priority,
    } : TaskFormDefaults,
    mode: "onChange",
  })

  // Use external submitting state if provided, otherwise use form state
  const isSubmitting = externalIsSubmitting || formIsSubmitting

  const description = watch("description")
  const descriptionLength = description?.length || 0

  // Handle form submission with proper typing
  const onFormSubmit: SubmitHandler<TaskFormData> = async (data) => {
    try {
      const taskData: CreateTaskInput | UpdateTaskInput = {
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        priority: data.priority,
        dueDate: data.dueDate.toISOString(),
      }

      if (onSubmit) {
        // Use external submit handler (API integration)
        onSubmit(taskData)
      } else {
        // Fallback for success callback
        onSuccess?.()
      }
      
      if (!isEditMode) {
        reset()
      }
      
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const submitDisabled = isSubmitting || !isValid || (!isEditMode && !isDirty)

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-card-foreground">
          Task Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter task title..."
          className={cn(
            "bg-background text-foreground border-input placeholder:text-muted-foreground",
            "focus:border-ring focus:ring-ring/20",
            errors.title && "border-destructive focus:border-destructive focus:ring-destructive/20"
          )}
          disabled={isSubmitting}
          autoFocus
        />
        {errors.title && (
          <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-card-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Add a description (optional)..."
          className={cn(
            "resize-none bg-background text-foreground border-input placeholder:text-muted-foreground",
            "focus:border-ring focus:ring-ring/20",
            errors.description && "border-destructive focus:border-destructive focus:ring-destructive/20"
          )}
          rows={3}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {descriptionLength}/500 characters
          </p>
        </div>
        {errors.description && (
          <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
        )}
      </div>

      {/* Priority Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-card-foreground">
          Priority <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select 
              value={field.value?.toString()} 
              onValueChange={(value) => field.onChange(Number(value) as Priority)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-background border-input text-card-foreground">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {PriorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "w-2 h-2 rounded-full",
                          option.color
                        )}
                      />
                      <span className={option.textColor}>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && (
          <p className="text-xs text-destructive font-medium">{errors.priority.message}</p>
        )}
      </div>

      {/* Due Date Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-card-foreground">
          Due Date <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Select due date..."
              disabled={isSubmitting}
              minDate={isEditMode ? undefined : new Date()} // Allow past dates in edit mode
              className={cn(
                "w-full bg-background border-input text-card-foreground",
                errors.dueDate && "border-destructive"
              )}
            />
          )}
        />
        {errors.dueDate && (
          <p className="text-xs text-destructive font-medium">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="bg-background text-card-foreground border-border hover:bg-muted"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={submitDisabled}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </div>
          ) : (
            isEditMode ? "Update Task" : "Create Task"
          )}
        </Button>
      </div>
    </form>
  )
} 