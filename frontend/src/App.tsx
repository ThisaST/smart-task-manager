import { TaskListContainer } from '@/modules/dashboard'
import { ThemeToggle } from '@/shared'
import { useThemeInitializer } from '@/shared/hooks/useThemeInitializer'

/**
 * Main App component with theme system integration
 */
function App() {
  // Initialize theme system
  useThemeInitializer()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-card-foreground">
              Task Manager
            </h1>
            
            {/* Theme Toggle */}
            <div className="flex items-center gap-4">
              <ThemeToggle variant="combo" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <TaskListContainer />
      </main>
    </div>
  )
}

export default App
