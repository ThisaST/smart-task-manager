import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TaskStatistics } from '@/shared/types/api'

interface PriorityChartProps {
  statistics?: TaskStatistics
  isLoading?: boolean
}

export function PriorityChart({ statistics, isLoading }: PriorityChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="w-full h-48" />
        </div>
      </Card>
    )
  }

  if (!statistics) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>No data available</p>
        </div>
      </Card>
    )
  }

  const priorityData = Object.entries(statistics.byPriority).map(([, data]) => ({
    name: data.label,
    total: data.count,
    completed: 0, // Backend doesn't provide completed count per priority yet
    pending: data.count // All tasks are pending since completed is 0
  }))

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
            <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 