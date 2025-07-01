import { Badge } from "@/components/ui/badge"
import { Priority } from "../types/task.types"
import { cn } from "@/utils/utils"

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

const priorityConfig = {
  [Priority.LOW]: {
    label: "Low",
    className: "bg-priority-low text-primary-foreground border-priority-low"
  },
  [Priority.MEDIUM]: {
    label: "Medium", 
    className: "bg-priority-medium text-primary-foreground border-priority-medium"
  },
  [Priority.HIGH]: {
    label: "High",
    className: "bg-priority-high text-primary-foreground border-priority-high"
  }
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  
  return (
    <Badge 
      className={cn(config.className, className)}
      variant="secondary"
    >
      {config.label}
    </Badge>
  )
} 