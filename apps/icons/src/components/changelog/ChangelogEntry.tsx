import type { ChangelogEntry as ChangelogEntryType } from '@/types/changelog'

interface ChangelogEntryProps {
  entry: ChangelogEntryType
}

export function ChangelogEntry({ entry }: ChangelogEntryProps) {
  return (
    <article id={entry.anchorId} className="scroll-mt-8">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-main-primary)]">
          {entry.title}
        </h2>
        <div className="flex items-center gap-3 mt-1 text-sm text-[var(--color-main-secondary)]">
          <span className="font-medium">{entry.version}</span>
          <span>&middot;</span>
          <time>{entry.date}</time>
        </div>
      </header>
      <div
        className="prose prose-sm max-w-none text-[var(--color-main-secondary)]
          prose-headings:text-[var(--color-main-primary)] prose-headings:font-semibold
          prose-strong:text-[var(--color-main-primary)] prose-a:text-[var(--color-main-accent)]
          prose-ul:list-disc prose-ul:pl-4
          prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />
    </article>
  )
}
