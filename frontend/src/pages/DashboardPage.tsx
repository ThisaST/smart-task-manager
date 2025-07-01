import { DashboardContainer } from '@/modules/dashboard'

export function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your tasks and productivity insights
        </p>
      </div>
      <DashboardContainer />
    </div>
  )
} 