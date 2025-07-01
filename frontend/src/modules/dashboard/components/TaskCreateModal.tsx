import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskCreateForm } from "./TaskCreateForm"
import type { Task } from "../types/task.types"

interface TaskCreateModalProps {
  task?: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskCreateModal({ task, open, onOpenChange }: TaskCreateModalProps) {
  const isEditMode = !!task
  
  const handleSuccess = () => {
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border shadow-xl backdrop-blur-sm">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-card-foreground">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditMode 
              ? `Update the details of "${task.title}".`
              : "Add a new task to your list. Fill in the details below."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <TaskCreateForm
            task={task}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 