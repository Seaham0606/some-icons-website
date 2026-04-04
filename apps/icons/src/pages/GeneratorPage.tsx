import { Link } from 'react-router-dom'
import { GeneratorForm } from '@/components/generator/GeneratorForm'
import { SomeIcon } from 'design-system'
import { ThemeButton } from '@/components/ThemeButton'
import { useUIStore } from '@/stores/uiStore'

function GeneratorThemeButton() {
  const setTheme = useUIStore((s) => s.setTheme)
  const mode = useUIStore((s) => s.getEffectiveTheme())
  return (
    <ThemeButton
      mode={mode}
      onToggle={() =>
        setTheme(useUIStore.getState().getEffectiveTheme() === 'dark' ? 'light' : 'dark')
      }
    />
  )
}

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-elevation)]">
      <header className="border-b border-[var(--color-border-base)]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
          >
            <SomeIcon
              iconName="arrow-left-triangle"
              iconStyle="outline"
              iconSize="xs"
              padding="0"
            />
            Back to icons
          </Link>
          <GeneratorThemeButton />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-main-primary)]">
            Changelog Generator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--color-main-secondary)]">
            Create changelog entries in markdown format for the Some Icons project.
          </p>
        </div>

        <GeneratorForm />
      </main>
    </div>
  )
}
