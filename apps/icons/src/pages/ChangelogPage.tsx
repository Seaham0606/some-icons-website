import { Link } from 'react-router-dom'
import { MainContent, ScrollArea } from '@/components/layout/MainContent'
import { Footer } from '@/components/layout/Footer'
import { ChangelogEntry } from '@/components/changelog/ChangelogEntry'
import { useChangelog } from '@/hooks/useChangelog'
import { useUIStore } from '@/stores/uiStore'
import { CdnIcon } from '@/components/ui/cdn-icon'

function ChangelogMobileHeader() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-base)] bg-[var(--color-background-elevation)]">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
        >
          <CdnIcon iconId="arrow-left-triangle" className="h-4 w-4" />
        </Link>
        <img src="/favicon.png" alt="Some Icons" className="w-6 h-6" />
        <h1 className="font-semibold text-[var(--color-main-primary)]">Changelog</h1>
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 -mr-2 text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? (
          <CdnIcon iconId="arrow-up-triangle" className="h-6 w-6" />
        ) : (
          <CdnIcon iconId="arrow-down-triangle" className="h-6 w-6" />
        )}
      </button>
    </header>
  )
}

export default function ChangelogPage() {
  const { data: entries, isLoading, error } = useChangelog()

  return (
    <div className="flex flex-col h-dvh">
      {/* Mobile header with back button and hamburger */}
      <ChangelogMobileHeader />

      <MainContent>
        <ScrollArea className="p-6 max-sm:p-4">
          {isLoading ? (
            <div className="text-[var(--color-main-secondary)]">Loading changelog...</div>
          ) : error ? (
            <div className="text-[var(--color-red-400)]">
              Failed to load changelog. Please try again.
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="max-w-2xl space-y-12">
              {entries.map((entry) => (
                <ChangelogEntry key={entry.anchorId} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-[var(--color-main-secondary)]">No changelog entries found.</div>
          )}
        </ScrollArea>
        <Footer />
      </MainContent>
    </div>
  )
}
