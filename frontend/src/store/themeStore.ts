import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ThemeStore, ThemeMode } from '@/shared/types/theme'
import { ThemeValue } from '@/shared/types/theme'
import { getSystemTheme, applyTheme, resolveTheme } from '@/shared/utils/theme'


/**
 * Create theme store with persistence
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      mode: ThemeValue.SYSTEM as ThemeMode,
      systemTheme: getSystemTheme(),
      
      get resolvedTheme() {
        const state = get()
        const mode = state?.mode ?? ThemeValue.SYSTEM
        const systemTheme = state?.systemTheme ?? getSystemTheme()
        return resolveTheme(mode, systemTheme)
      },
      
      get isDark() {
        const state = get()
        return state?.resolvedTheme === ThemeValue.DARK
      },
      
      get isLight() {
        const state = get()
        return state?.resolvedTheme === ThemeValue.LIGHT
      },
      
      get isSystem() {
        const state = get()
        return state?.mode === ThemeValue.SYSTEM
      },
      
      // Actions
      setTheme: (mode: ThemeMode) =>
        set((state) => {
          state.mode = mode
          applyTheme(mode, state.systemTheme)
        }),
      
      toggleTheme: () =>
        set((state) => {
          // Cycle through: light -> dark -> system -> light
          if (state.mode === ThemeValue.LIGHT) {
            state.mode = ThemeValue.DARK
          } else if (state.mode === ThemeValue.DARK) {
            state.mode = ThemeValue.SYSTEM
          } else {
            state.mode = ThemeValue.LIGHT
          }
          
          applyTheme(state.mode, state.systemTheme)
        }),
      
      setSystemTheme: (theme: ThemeValue.LIGHT | ThemeValue.DARK) =>
        set((state) => {
          state.systemTheme = theme
          // If in system mode, reapply theme with new system preference
          if (state.mode === ThemeValue.SYSTEM) {
            applyTheme(state.mode, theme)
          }
        }),
    })),
    {
      name: 'task-manager-theme',
      storage: createJSONStorage(() => localStorage),
      // Only persist the mode, not computed values
      partialize: (state) => ({ mode: state.mode }),
      // Initialize system theme detection after hydration
      onRehydrateStorage: () => (state, error) => {
        if (error || !state || typeof window === 'undefined') return
        
        const currentSystemTheme = getSystemTheme()
        
        // Use setTimeout to ensure React has time to mount
        setTimeout(() => {
          // Update system theme
          useThemeStore.setState({ systemTheme: currentSystemTheme })
          
          applyTheme(state.mode, currentSystemTheme)
        }, 0)
      },
    }
  )
)
