import { Card } from '@/components/ui/card'

interface OverviewCardsProps {
  stats: {
    total: number
    completed: number
    pending: number
    overdue: number
    completionRate: number
  }
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Tasks</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2">{stats.total}</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2 text-green-600">{stats.completed}</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stats.completionRate}% completion rate</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2 text-yellow-600">{stats.pending}</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Overdue</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2 text-red-600">{stats.overdue}</p>
      </Card>
    </div>
  )
} 