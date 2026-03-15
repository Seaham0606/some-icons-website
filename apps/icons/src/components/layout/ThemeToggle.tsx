import { Switch } from '@/components/ui/switch'
import { useUIStore } from '@/stores/uiStore'

export function ThemeToggle() {
  const setTheme = useUIStore((state) => state.setTheme)
  const effectiveTheme = useUIStore((state) => state.getEffectiveTheme())

  const isDark = effectiveTheme === 'dark'

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center">
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
    </div>
  )
}
