import type { ChangelogEntry as ChangelogEntryType } from '@/types/changelog'

interface ChangelogEntryProps {
  entry: ChangelogEntryType
}

export function ChangelogEntry({ entry }: ChangelogEntryProps) {
  return (
    <article id={entry.anchorId} className="scroll-mt-8">
      <header className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          {entry.title}
        </h2>
        <div className="flex items-center gap-3 mt-1 text-sm text-foreground-secondary">
          <span className="font-medium">{entry.version}</span>
          <span>&middot;</span>
          <time>{entry.date}</time>
        </div>
      </header>
      <div
        className="prose prose-sm max-w-none text-foreground-secondary
          prose-headings:text-foreground prose-headings:font-semibold
          prose-strong:text-foreground prose-a:text-primary
          prose-ul:list-disc prose-ul:pl-4
          prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />
    </article>
  )
}
