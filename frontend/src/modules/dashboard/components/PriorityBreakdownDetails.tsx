import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PriorityBreakdownDetailsProps {
  priorityStats: Record<string, {
    total: number
    completed: number
    pending: number
  }>
}

export function PriorityBreakdownDetails({ priorityStats }: PriorityBreakdownDetailsProps) {
  // Priority colors mapped to string keys
  const priorityColors = {
    'LOW': '#22c55e',
    'MEDIUM': '#f59e0b', 
    'HIGH': '#ef4444'
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Priority Breakdown Details</h3>
      <div className="space-y-4">
        {Object.entries(priorityStats).map(([priority, data]) => (
          <div key={priority} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: priorityColors[priority as keyof typeof priorityColors] }}
              ></div>
              <span className="font-medium">{priority} Priority</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">{data.total}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-semibold text-green-600">{data.completed}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="font-semibold text-yellow-600">{data.pending}</p>
              </div>
              <Badge variant="outline">
                {data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}% Complete
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 