import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-main-primary)]">Page not found</h1>
      <p className="text-[var(--color-main-secondary)]">
        This page doesn&apos;t exist or has moved.
      </p>
      <Link
        to="/"
        className="text-[var(--color-main-primary)] underline underline-offset-4 hover:text-[var(--color-main-secondary)]"
      >
        Back to the icon library
      </Link>
    </main>
  )
}
