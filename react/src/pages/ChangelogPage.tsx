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
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'

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
    <div className="flex h-screen max-md:flex-col">
      <Sidebar>
        <SidebarHeader>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
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
        <ScrollArea className="p-8 max-md:p-4">
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
