import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { GeneratorForm } from '@/components/generator/GeneratorForm'
import { CdnIcon } from '@/components/ui/cdn-icon'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-elevation)]">
      <header className="border-b border-[var(--color-border-base)]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
          >
            <CdnIcon iconId="arrow-left-triangle" className="h-4 w-4" />
            Back to icons
          </Link>
          <ThemeToggle />
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
