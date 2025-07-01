import { DashboardContainer } from '@/modules/dashboard'

export function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your tasks and productivity insights
        </p>
      </div>
      <DashboardContainer />
    </div>
  )
} 