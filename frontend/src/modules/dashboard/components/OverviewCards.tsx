import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TaskStatistics } from '@/shared/types/api'

interface OverviewCardsProps {
  statistics?: TaskStatistics
  isLoading?: boolean
}

export function OverviewCards({ statistics, isLoading }: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 sm:p-6">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-16 mt-2" />
          </Card>
        ))}
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="text-center text-muted-foreground">
            <p>No data available</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Tasks</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2">{statistics.total}</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2 text-green-600">{statistics.completed}</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{statistics.completionRate}% completion rate</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2 text-yellow-600">{statistics.pending}</p>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Overdue</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold mt-2 text-red-600">{statistics.overdue}</p>
      </Card>
    </div>
  )
} 