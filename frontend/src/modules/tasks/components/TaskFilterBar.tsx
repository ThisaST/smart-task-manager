import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { PRIORITY_OPTIONS } from "../constants/task.constants"
import type { FilterConfig, Priority } from "../types/task.types"

interface TaskFilterBarProps {
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  taskCounts: {
    total: number
    completed: number
    pending: number
    byPriority: Record<Priority, number>
  }
}

export function TaskFilterBar({ filters, onFiltersChange, taskCounts }: TaskFilterBarProps) {
  const handleStatusChange = (status: FilterConfig['status']) => {
    onFiltersChange({ ...filters, status })
  }

  const handlePriorityChange = (priority: FilterConfig['priority']) => {
    onFiltersChange({ ...filters, priority })
  }

  const clearFilters = () => {
    onFiltersChange({ status: 'all', priority: 'all', searchQuery: '' })
  }

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all'

  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 border-b">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Filter by:</span>
        
        {/* Status Filter */}
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All ({taskCounts.total})
            </SelectItem>
            <SelectItem value="pending">
              Pending ({taskCounts.pending})
            </SelectItem>
            <SelectItem value="completed">
              Completed ({taskCounts.completed})
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select 
          value={filters.priority === 'all' ? 'all' : filters.priority.toString()} 
          onValueChange={(value) => handlePriorityChange(value === 'all' ? 'all' : parseInt(value) as Priority)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Priorities
            </SelectItem>
            {PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${option.color}`} />
                  {option.label} ({taskCounts.byPriority[option.value] || 0})
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Status: {filters.status}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-transparent"
                onClick={() => handleStatusChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.priority !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              Priority: {PRIORITY_OPTIONS.find(p => p.value === filters.priority)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1 hover:bg-transparent"
                onClick={() => handlePriorityChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
} 