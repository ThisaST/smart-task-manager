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

interface PriorityChartProps {
  priorityData: Array<{
    name: string
    value: number
    completed: number
    pending: number
  }>
}

export function PriorityChart({ priorityData }: PriorityChartProps) {
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