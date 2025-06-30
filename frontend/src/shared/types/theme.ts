/**
 * Theme System Types
 * 
 * Comprehensive type definitions for our theme system including
 * theme modes, color palettes, and store interfaces.
 */

/**
 * Theme value enum for type safety and consistency
 */
export enum ThemeValue {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

/**
 * Available theme modes
 */
export type ThemeMode = ThemeValue.LIGHT | ThemeValue.DARK | ThemeValue.SYSTEM

/**
 * Theme color palette structure
 */
export interface ThemeColors {
  // Core colors
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  
  // Semantic colors
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  
  // Status colors
  destructive: string
  destructiveForeground: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
  info: string
  infoForeground: string
  
  // UI elements
  border: string
  input: string
  ring: string
  
  // Task-specific colors
  priority: {
    low: string
    medium: string
    high: string
  }
  
  status: {
    todo: string
    progress: string
    review: string
    done: string
  }
  
  chart: {
    1: string
    2: string
    3: string
    4: string
    5: string
  }
}

/**
 * Theme configuration object
 */
export interface ThemeConfig {
  mode: ThemeMode
  colors: ThemeColors
  radius: string
  shadows: {
    sm: string
    base: string
    md: string
    lg: string
  }
}

/**
 * Theme store state interface
 */
export interface ThemeStore {
  // State
  mode: ThemeMode
  resolvedTheme: ThemeValue.LIGHT | ThemeValue.DARK
  systemTheme: ThemeValue.LIGHT | ThemeValue.DARK
  
  // Actions
  setTheme: (mode: ThemeMode) => void
  toggleTheme: () => void
  setSystemTheme: (theme: ThemeValue.LIGHT | ThemeValue.DARK) => void
  
  // Computed
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeMode
  storageKey?: string
  enableSystem?: boolean
}

/**
 * Theme context value
 */
export interface ThemeContextValue extends ThemeStore {
  // Context-specific method to force theme refresh
  refreshTheme: () => void
}

/**
 * Theme toggle component props
 */
export interface ThemeToggleProps {
  variant?: 'icon' | 'text' | 'combo'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Priority levels for tasks
 */
export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

/**
 * Task status options
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'progress',
  IN_REVIEW = 'review',
  DONE = 'done'
}

/**
 * Theme utility functions type
 */
export interface ThemeUtils {
  getThemeColors: (mode: ThemeValue.LIGHT | ThemeValue.DARK) => ThemeColors
  applyTheme: (mode: ThemeValue.LIGHT | ThemeValue.DARK) => void
  getSystemTheme: () => ThemeValue.LIGHT | ThemeValue.DARK
  watchSystemTheme: (callback: (theme: ThemeValue.LIGHT | ThemeValue.DARK) => void) => () => void
} 