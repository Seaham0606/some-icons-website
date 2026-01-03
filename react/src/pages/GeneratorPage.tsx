import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { GeneratorForm } from '@/components/generator/GeneratorForm'
import { ArrowLeft } from 'lucide-react'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to icons
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            Changelog Generator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-foreground-secondary">
            Create changelog entries in markdown format for the Some Icons project.
          </p>
        </div>

        <GeneratorForm />
      </main>
    </div>
  )
}
