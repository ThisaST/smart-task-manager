import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TaskStatistics } from '@/shared/types/api'

interface TaskStatusChartProps {
  statistics?: TaskStatistics
  isLoading?: boolean
}

export function TaskStatusChart({ statistics, isLoading }: TaskStatusChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="h-64 flex items-center justify-center">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
      </Card>
    )
  }

  if (!statistics) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <p>No data available</p>
        </div>
      </Card>
    )
  }

  const statusData = [
    {
      name: 'Completed',
      value: statistics.completed,
      color: '#22c55e'
    },
    {
      name: 'Pending',
      value: statistics.pending,
      color: '#eab308'
    },
    {
      name: 'Overdue',
      value: statistics.overdue,
      color: '#ef4444'
    }
  ].filter(item => item.value > 0)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = (entry: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = entry
    if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent) return null
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 