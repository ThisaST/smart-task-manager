import { OverviewCards } from '../components/OverviewCards'
import { TaskStatusChart } from '../components/TaskStatusChart'
import { PriorityChart } from '../components/PriorityChart'
import { useTaskStatistics } from '@/shared/hooks/useTaskQueries'

/**
 * Dashboard container component that orchestrates dashboard widgets
 */
export function DashboardContainer() {
  const { data: statistics, isLoading, error } = useTaskStatistics()

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-destructive mb-4">
          <h3 className="text-lg font-semibold">Error loading dashboard</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen">

      <div className="grid gap-4 md:gap-6">
        <OverviewCards 
          statistics={statistics?.data} 
          isLoading={isLoading} 
        />
        
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <TaskStatusChart 
            statistics={statistics?.data} 
            isLoading={isLoading} 
          />
          <PriorityChart 
            statistics={statistics?.data} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  )
} 