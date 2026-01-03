import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  setTheme: (theme: Theme) => void
  getEffectiveTheme: () => 'light' | 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyEffectiveTheme(theme: Theme) {
  const effective = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', effective)
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        applyEffectiveTheme(theme)
      },
      getEffectiveTheme: () => {
        const { theme } = get()
        return theme === 'system' ? getSystemTheme() : theme
      },
    }),
    {
      name: 'some-icons-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyEffectiveTheme(state.theme)
        }
      },
    }
  )
)

export function initTheme() {
  const stored = localStorage.getItem('some-icons-ui')
  let theme: Theme = 'system'

  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.theme) {
        theme = state.theme
      }
    } catch {
      // Invalid JSON, use system theme
    }
  }

  applyEffectiveTheme(theme)

  // Listen for system theme changes when using 'system' preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useUIStore.getState().theme
    if (currentTheme === 'system') {
      applyEffectiveTheme('system')
    }
  })
}
