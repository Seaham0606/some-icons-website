import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Theme preference (persisted under `some-icons-ui`):
 * - `system` (default): `data-theme` follows `prefers-color-scheme` and updates when OS changes.
 * - `light` | `dark`: manual override from the header control (or Generator switch); no longer follows OS until set back to `system` if exposed later.
 */
type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  setTheme: (theme: Theme) => void
  getEffectiveTheme: () => 'light' | 'dark'
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyEffectiveTheme(theme: Theme) {
  const effective = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', effective)
}

/**
 * Theme updates apply synchronously (no `document.startViewTransition`).
 * A root-level view transition snapshots the whole DOM; on the icon grid that forces the
 * browser to capture raster for hundreds of tiles and feels laggy. Prefer instant theme flip.
 */
function runThemeUpdate(update: () => void) {
  update()
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        runThemeUpdate(() => {
          set({ theme })
          applyEffectiveTheme(theme)
        })
      },
      getEffectiveTheme: () => {
        const { theme } = get()
        return theme === 'system' ? getSystemTheme() : theme
      },
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
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
      const { state } = JSON.parse(stored) as { state?: { theme?: Theme } }
      if (state?.theme === 'light' || state?.theme === 'dark' || state?.theme === 'system') {
        theme = state.theme
      }
    } catch {
      // Invalid JSON, use system theme
    }
  } else {
    const legacy = localStorage.getItem('theme')
    if (legacy === 'light' || legacy === 'dark') {
      theme = legacy
      useUIStore.setState({ theme: legacy })
    }
  }

  applyEffectiveTheme(theme)

  // Listen for system theme changes when using 'system' preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useUIStore.getState().theme
    if (currentTheme === 'system') {
      runThemeUpdate(() => applyEffectiveTheme('system'))
    }
  })
}
