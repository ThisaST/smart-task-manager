import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TaskListContainer } from './TaskListContainer'
import { TaskDashboard } from '../components/TaskDashboard'
import { List, BarChart3 } from 'lucide-react'

/**
 * DashboardContainer - Main container with tabs for task list and analytics
 */
export function DashboardContainer() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-4">
          <TaskListContainer />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">Task Analytics</h2>
              <p className="text-muted-foreground">
                Visualize your task completion statistics and productivity metrics
              </p>
            </div>
            <TaskDashboard />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 