import type { ChangelogEntry } from '@/types/changelog'
import { cn } from '@/lib/utils'

interface VersionListProps {
  entries: ChangelogEntry[]
  activeId?: string
}

export function VersionList({ entries, activeId }: VersionListProps) {
  return (
    <nav className="space-y-1">
      {entries.map((entry) => (
        <a
          key={entry.anchorId}
          href={`#${entry.anchorId}`}
          className={cn(
            'block px-3 py-2 rounded-lg text-sm transition-colors',
            activeId === entry.anchorId
              ? 'bg-[var(--color-intent-accent)] text-[var(--color-main-primary)] font-medium'
              : 'text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] hover:bg-[var(--color-intent-accent)]'
          )}
        >
          {entry.version}
        </a>
      ))}
    </nav>
  )
}
