import { Link } from 'react-router-dom'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/layout/Sidebar'
import { MainContent, ScrollArea } from '@/components/layout/MainContent'
import { Footer } from '@/components/layout/Footer'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { VersionList } from '@/components/changelog/VersionList'
import { ChangelogEntry } from '@/components/changelog/ChangelogEntry'
import { useChangelog } from '@/hooks/useChangelog'
import { useUIStore } from '@/stores/uiStore'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { useState, useEffect, useMemo } from 'react'

function ChangelogMobileHeader() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-background">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
        >
          <CdnIcon iconId="arrow-left-triangle" className="h-4 w-4" />
        </Link>
        <img src="/favicon.png" alt="Some Icons" className="w-6 h-6" />
        <h1 className="font-semibold text-foreground">Changelog</h1>
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 -mr-2 text-foreground-secondary hover:text-foreground transition-colors"
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
  const [hashId, setHashId] = useState(() => window.location.hash.slice(1) || undefined)

  useEffect(() => {
    const handleHashChange = () => {
      setHashId(window.location.hash.slice(1) || undefined)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const activeId = useMemo(() => {
    if (hashId) return hashId
    if (entries && entries.length > 0) return entries[0].anchorId
    return undefined
  }, [hashId, entries])

  return (
    <div className="flex flex-col h-dvh md:flex-row">
      {/* Mobile header with back button and hamburger */}
      <ChangelogMobileHeader />

      <Sidebar>
        <SidebarHeader>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            <CdnIcon iconId="arrow-left-triangle" className="h-4 w-4" />
            Back to icons
          </Link>
          <div className="flex items-center gap-3 mt-4">
            <img
              src="/favicon.png"
              alt="Some Icons"
              className="w-8 h-8"
            />
            <h1 className="font-semibold text-foreground">Changelog</h1>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {isLoading ? (
            <div className="text-sm text-foreground-secondary">Loading...</div>
          ) : error ? (
            <div className="text-sm text-destructive">Failed to load</div>
          ) : entries ? (
            <VersionList entries={entries} activeId={activeId} />
          ) : null}
        </SidebarContent>

        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <ScrollArea className="p-6 max-sm:p-4">
          {isLoading ? (
            <div className="text-foreground-secondary">Loading changelog...</div>
          ) : error ? (
            <div className="text-destructive">
              Failed to load changelog. Please try again.
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="max-w-2xl space-y-12">
              {entries.map((entry) => (
                <ChangelogEntry key={entry.anchorId} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-foreground-secondary">No changelog entries found.</div>
          )}
        </ScrollArea>
        <Footer />
      </MainContent>
    </div>
  )
}
