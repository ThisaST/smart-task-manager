import { useThemeStore } from '@/store/themeStore'

/**
 * Hook to get current theme information for conditional rendering
 * 
 * Provides a clean interface to access theme state and actions
 * throughout the application.
 */
export function useTheme() {
  const store = useThemeStore()
  
  return {
    theme: store.resolvedTheme,
    mode: store.mode,
    systemTheme: store.systemTheme,
    isDark: store.isDark,
    isLight: store.isLight,
    isSystem: store.isSystem,
    setTheme: store.setTheme,
    toggleTheme: store.toggleTheme,
  }
} 