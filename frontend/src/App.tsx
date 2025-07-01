import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from '@/shared/components/Navigation'
import { DashboardPage } from '@/pages/DashboardPage'
import { TasksPage } from '@/pages/TasksPage'
import { ThemeInitializer } from '@/shared/components/ThemeInitializer'
import './index.css'

/**
 * Main App component with theme system integration
 */
function App() {
  return (
    <Router>
      <ThemeInitializer />
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
