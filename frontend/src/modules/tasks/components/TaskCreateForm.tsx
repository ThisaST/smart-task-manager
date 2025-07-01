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
import type { CreateTaskInput, Task } from "../types/task.types"
import { TaskFormSchema, TaskEditSchema, type TaskFormData, type TaskEditData, PriorityOptions, TaskFormDefaults } from "../schemas/task-form.schemas"
import { useTaskOperations } from "../hooks/useTaskOperations"

interface TaskCreateFormProps {
  task?: Task
  onCancel: () => void
  onSuccess?: () => void
}

export function TaskCreateForm({ task, onCancel, onSuccess }: TaskCreateFormProps) {
  const { addTask, updateTask } = useTaskOperations()
  const isEditMode = !!task
  
  const schema = isEditMode ? TaskEditSchema : TaskFormSchema
  type FormData = typeof isEditMode extends true ? TaskEditData : TaskFormData
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode ? {
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate,
      priority: task.priority,
    } : TaskFormDefaults,
    mode: "onChange",
  })

  const description = watch("description")
  const descriptionLength = description?.length || 0

  // Handle form submission
  const onFormSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (isEditMode && task) {
        // Update existing task
        const updatedTask: Task = {
          ...task,
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          priority: data.priority,
          dueDate: data.dueDate,
          modifiedDate: new Date(),
        }
        await updateTask(updatedTask)
      } else {
        // Create new task
        const cleanedData: CreateTaskInput = {
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          priority: data.priority,
          dueDate: data.dueDate,
        }
        await addTask(cleanedData)
        reset()
      }
      
      // Call success callback
      onSuccess?.()
      
    } catch (error) {
      // Error is already handled by useTaskOperations hook
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