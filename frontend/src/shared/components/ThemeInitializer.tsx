import { useThemeInitializer } from '../hooks/useThemeInitializer'
import { Toaster } from '@/components/ui/sonner'

export function ThemeInitializer() {
  // Initialize theme system
  useThemeInitializer()

  return (
    <>
      {/* Toast Notifications */}
      <Toaster />
    </>
  )
} 