import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { BarChart3, CheckSquare } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Analytics & Insights'
    },
    {
      path: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      description: 'Manage Tasks'
    }
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Task Manager</h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2 h-9"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle variant="combo" />
          </div>
        </div>
      </div>
    </nav>
  )
} 