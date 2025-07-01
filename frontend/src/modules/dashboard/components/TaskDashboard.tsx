import React, { useMemo } from 'react'
import { useTaskStore } from '@/store/taskStore'
import { Priority } from '../types/task.types'
import { OverviewCards } from './OverviewCards'
import { TaskStatusChart } from './TaskStatusChart'
import { PriorityChart } from './PriorityChart'
import { PriorityBreakdownDetails } from './PriorityBreakdownDetails'

export function TaskDashboard() {
  const { tasks } = useTaskStore()

  // Calculate overview statistics
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Priority breakdown - use proper priority names
    const priorityStats = {
      LOW: {
        total: tasks.filter(task => task.priority === Priority.LOW).length,
        completed: tasks.filter(task => task.priority === Priority.LOW && task.completed).length,
        pending: tasks.filter(task => task.priority === Priority.LOW && !task.completed).length
      },
      MEDIUM: {
        total: tasks.filter(task => task.priority === Priority.MEDIUM).length,
        completed: tasks.filter(task => task.priority === Priority.MEDIUM && task.completed).length,
        pending: tasks.filter(task => task.priority === Priority.MEDIUM && !task.completed).length
      },
      HIGH: {
        total: tasks.filter(task => task.priority === Priority.HIGH).length,
        completed: tasks.filter(task => task.priority === Priority.HIGH && task.completed).length,
        pending: tasks.filter(task => task.priority === Priority.HIGH && !task.completed).length
      }
    }

    // Overdue tasks
    const now = new Date()
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length

    return {
      total,
      completed,
      pending,
      completionRate,
      priorityStats,
      overdue
    }
  }, [tasks])

  // Priority distribution data for charts
  const priorityChartData = useMemo(() => {
    return Object.entries(stats.priorityStats).map(([priority, data]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
      value: data.total,
      completed: data.completed,
      pending: data.pending
    }))
  }, [stats.priorityStats])

  // Completion status data for pie chart
  const statusChartData = useMemo(() => [
    { name: 'Completed', value: stats.completed, color: '#22c55e' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Overdue', value: stats.overdue, color: '#ef4444' }
  ], [stats.completed, stats.pending, stats.overdue])

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <OverviewCards stats={stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskStatusChart statusData={statusChartData} />
        <PriorityChart priorityData={priorityChartData} />
      </div>

      {/* Priority Details */}
      <PriorityBreakdownDetails priorityStats={stats.priorityStats} />
    </div>
  )
} 