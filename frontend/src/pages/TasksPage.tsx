import { TaskListContainer } from '@/modules/tasks'

export function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and organize your tasks efficiently
        </p>
      </div>
      <TaskListContainer />
    </div>
  )
} 