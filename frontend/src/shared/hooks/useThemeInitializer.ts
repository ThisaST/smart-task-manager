
import React from 'react'
import { useThemeStore } from '@/store/themeStore'
import { ThemeValue } from '@/shared/types/theme'
import { getSystemTheme, applyTheme } from '@/shared/utils/theme'

/**
 * Initialize the theme system and keep it in sync with system-level changes.
 */
export const useThemeInitializer = (): void => {
  const { setSystemTheme, mode, systemTheme } = useThemeStore()

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? ThemeValue.DARK : ThemeValue.LIGHT
      setSystemTheme(newSystemTheme)
    }

    // Ensure theme is applied on mount (handles initial load)
    const currentSystemTheme = getSystemTheme()
    
    const root = document.documentElement
    const expectedDark = mode === ThemeValue.DARK || 
      (mode === ThemeValue.SYSTEM && currentSystemTheme === ThemeValue.DARK)
    const isDarkApplied = root.classList.contains('dark')
    
    if (expectedDark !== isDarkApplied) {
      applyTheme(mode, currentSystemTheme)
    }

    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [setSystemTheme, mode, systemTheme])
} 