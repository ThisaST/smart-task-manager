/**
 * Theme Utility Functions
 *
 * Centralized helper functions for theme management
 */

import { ThemeValue } from '@/shared/types/theme'
import type { ThemeMode } from '@/shared/types/theme'

/**
 * Detect the user's current system color-scheme preference.
 */
export const getSystemTheme = (): ThemeValue.LIGHT | ThemeValue.DARK => {
  if (typeof window === 'undefined') return ThemeValue.LIGHT
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ThemeValue.DARK
    : ThemeValue.LIGHT
}

/**
 * Apply the provided theme to the <html> element.
 */
export const applyTheme = (
  mode: ThemeMode,
  systemTheme: ThemeValue.LIGHT | ThemeValue.DARK
): void => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const shouldBeDark =
    mode === ThemeValue.DARK || (mode === ThemeValue.SYSTEM && systemTheme === ThemeValue.DARK)

  if (shouldBeDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  root.setAttribute('data-theme', mode)
  root.setAttribute('data-resolved-theme', shouldBeDark ? ThemeValue.DARK : ThemeValue.LIGHT)
}

/**
 * Resolve the "effective" theme to either LIGHT or DARK.
 */
export const resolveTheme = (
  mode: ThemeMode,
  systemTheme: ThemeValue.LIGHT | ThemeValue.DARK
): ThemeValue.LIGHT | ThemeValue.DARK => {
  return mode === ThemeValue.SYSTEM ? systemTheme : (mode as ThemeValue.LIGHT | ThemeValue.DARK)
}

/**
 * Utility getter for conditional class application.
 */
export const getThemeClasses = (theme: ThemeValue.LIGHT | ThemeValue.DARK) => ({
  light: theme === ThemeValue.LIGHT,
  dark: theme === ThemeValue.DARK,
})

/**
 * Subscribe to system theme changes. Returns an unsubscribe handler.
 */
export const watchSystemTheme = (
  callback: (theme: ThemeValue.LIGHT | ThemeValue.DARK) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? ThemeValue.DARK : ThemeValue.LIGHT)
  }

  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}

/**
 * Aggregated export for convenience when a single object is preferred.
 */
export const themeUtils = {
  getSystemTheme,
  applyTheme,
  resolveTheme,
  getThemeClasses,
  watchSystemTheme,
} 