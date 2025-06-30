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
      
      // Computed properties
      get resolvedTheme() {
        const { mode, systemTheme } = get()
        return resolveTheme(mode, systemTheme)
      },
      
      get isDark() {
        return get().resolvedTheme === ThemeValue.DARK
      },
      
      get isLight() {
        return get().resolvedTheme === ThemeValue.LIGHT
      },
      
      get isSystem() {
        return get().mode === ThemeValue.SYSTEM
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
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // Update system theme on hydration
          const currentSystemTheme = getSystemTheme()
          state.systemTheme = currentSystemTheme
          
          // Apply theme immediately - React will handle this quickly
          applyTheme(state.mode, currentSystemTheme)
        }
      },
    }
  )
)
