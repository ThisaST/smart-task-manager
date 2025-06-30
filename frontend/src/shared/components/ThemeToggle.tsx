import { Moon, Sun, Monitor } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

import { Button } from '@/components/ui/button'
import type { ThemeToggleProps } from '@/shared/types/theme'
import { ThemeValue } from '@/shared/types/theme'
import { cn } from '@/utils/utils'

/**
 * ThemeToggle Component
 * 
 * A flexible theme toggle component that supports multiple variants
 * and provides accessibility features for theme switching.
 */
export function ThemeToggle({ 
  variant = 'icon', 
  size = 'md', 
  className 
}: ThemeToggleProps) {
  const { mode, toggleTheme, isDark, isLight, isSystem } = useThemeStore()
  
  // Map our size to Button component sizes
  const buttonSize = size === 'md' ? 'default' : size
  
  // Icon size classes
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }
  
  // Get current theme icon
  const getCurrentIcon = () => {
    if (isSystem) return <Monitor className={iconSizes[size]} />
    if (isDark) return <Moon className={iconSizes[size]} />
    return <Sun className={iconSizes[size]} />
  }
  
  // Get theme label
  const getThemeLabel = () => {
    if (isSystem) return 'System'
    if (isDark) return 'Dark'
    return 'Light'
  }
  
  // Get next theme for accessibility
  const getNextTheme = () => {
    if (mode === ThemeValue.LIGHT) return ThemeValue.DARK
    if (mode === ThemeValue.DARK) return ThemeValue.SYSTEM
    return ThemeValue.LIGHT
  }
  
  // Handle theme toggle
  const handleToggle = () => {
    toggleTheme()
  }
  
  // Render based on variant
  if (variant === 'text') {
    return (
      <Button
        variant="outline"
        size={buttonSize}
        onClick={handleToggle}
        className={cn('gap-2', className)}
        aria-label={`Switch to ${getNextTheme()} theme`}
      >
        {getCurrentIcon()}
        <span>{getThemeLabel()}</span>
      </Button>
    )
  }
  
  if (variant === 'combo') {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
        <Button
          variant={isLight ? "secondary" : "ghost"}
          size="sm"
          onClick={() => useThemeStore.getState().setTheme(ThemeValue.LIGHT)}
          className={cn(
            'h-8 w-8 p-0',
            isLight && 'bg-background text-foreground shadow-sm',
            !isLight && 'text-muted-foreground hover:bg-background/50'
          )}
          aria-label="Switch to light theme"
          aria-pressed={isLight}
        >
          <Sun className="h-4 w-4" />
        </Button>
        
        <Button
          variant={isDark ? "secondary" : "ghost"}
          size="sm"
          onClick={() => useThemeStore.getState().setTheme(ThemeValue.DARK)}
          className={cn(
            'h-8 w-8 p-0',
            isDark && 'bg-background text-foreground shadow-sm',
            !isDark && 'text-muted-foreground hover:bg-background/50'
          )}
          aria-label="Switch to dark theme"
          aria-pressed={isDark}
        >
          <Moon className="h-4 w-4" />
        </Button>
        
        <Button
          variant={isSystem ? "secondary" : "ghost"}
          size="sm"
          onClick={() => useThemeStore.getState().setTheme(ThemeValue.SYSTEM)}
          className={cn(
            'h-8 w-8 p-0',
            isSystem && 'bg-background text-foreground shadow-sm',
            !isSystem && 'text-muted-foreground hover:bg-background/50'
          )}
          aria-label="Switch to system theme"
          aria-pressed={isSystem}
        >
          <Monitor className="h-4 w-4" />
        </Button>
      </div>
    )
  }
  
  // Default icon variant
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={className}
      aria-label={`Switch to ${getNextTheme()} theme. Current theme: ${getThemeLabel()}`}
      title={`Current theme: ${getThemeLabel()}. Click to switch to ${getNextTheme()}.`}
    >
      {getCurrentIcon()}
    </Button>
  )
}

 