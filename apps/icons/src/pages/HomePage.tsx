import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/layout/Sidebar'
import { MainContent, ScrollArea } from '@/components/layout/MainContent'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { Footer } from '@/components/layout/Footer'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SearchInput } from '@/components/controls/SearchInput'
import { StyleToggle } from '@/components/controls/StyleToggle'
import { CategorySelect } from '@/components/controls/CategorySelect'
import { ColorPicker } from '@/components/controls/ColorPicker'
import { SizeSelector } from '@/components/controls/SizeSelector'
import { FormatSelector } from '@/components/controls/FormatSelector'
import { ExportButton } from '@/components/controls/ExportButton'
import { SegmentedButton } from '@/components/ui/segmented-control'
import { IconGrid } from '@/components/icons/IconGrid'
import { useChangelog, getLatestVersion } from '@/hooks/useChangelog'
import { useIcons } from '@/hooks/useIcons'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useMemo } from 'react'
import type { Icon } from '@/types/icon'
import { Link } from 'react-router-dom'

function normalizeQuery(s: string): string {
  return s.trim().toLowerCase()
}

function matches(icon: Icon, query: string): boolean {
  const q = normalizeQuery(query)
  if (!q) return true

  const searchableText = [
    icon.id,
    icon.category,
    ...(icon.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()

  return q.split(/\s+/).every((term) => searchableText.includes(term))
}

function getDerivedSortKey(iconId: string): string {
  const parts = iconId.split('-')
  if (parts.length > 1) {
    return parts.slice(1).join('-')
  }
  return iconId
}

export default function HomePage() {
  const { data: entries } = useChangelog()
  const version = getLatestVersion(entries)
  const { data: icons } = useIcons()
  const count = useSelectionStore((state) => state.count)
  const selectAll = useSelectionStore((state) => state.selectAll)
  const clear = useSelectionStore((state) => state.clear)
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const category = useFilterStore((state) => state.category)
  const style = useFilterStore((state) => state.style)

  // Get filtered icons for select all functionality
  const filteredIcons = useMemo(() => {
    if (!icons) return []

    let result = icons

    if (category !== 'all') {
      result = result.filter((icon) => icon.category === category)
    }

    if (searchQuery) {
      result = result.filter((icon) => matches(icon, searchQuery))
    }

    result = result.filter((icon) => icon.files[style])

    if (category === 'all') {
      result = [...result].sort((a, b) =>
        getDerivedSortKey(a.id).localeCompare(getDerivedSortKey(b.id))
      )
    } else {
      result = [...result].sort((a, b) => a.id.localeCompare(b.id))
    }

    return result
  }, [icons, searchQuery, category, style])

  const handleSelectAll = () => {
    const iconIds = filteredIcons.map((icon) => icon.id)
    selectAll(iconIds)
  }

  const handleDeselect = () => {
    clear()
  }

  return (
    <div className="flex flex-col h-dvh" style={{ background: 'var(--win-bg)', fontFamily: "'Tahoma','MS Sans Serif',Arial,sans-serif" }}>
      {/* Win2K Title Bar */}
      <div className="win-titlebar shrink-0" style={{ height: '22px', padding: '2px 4px', gap: '4px' }}>
        {/* App icon placeholder */}
        <img src="/logo.svg" alt="" className="h-4 w-4" style={{ filter: 'invert(1)', imageRendering: 'pixelated' }} />
        <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0px' }}>Some Icons</span>
        {/* Window control buttons */}
        <div className="ml-auto flex gap-px">
          {['_', '□', '✕'].map((c, i) => (
            <button
              key={i}
              className="win-raised"
              style={{ width: '18px', height: '16px', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default', fontFamily: "'Marlett','Tahoma',sans-serif" }}
              tabIndex={-1}
              aria-hidden="true"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Win2K Menu Bar */}
      <div
        className="shrink-0 flex items-center gap-0"
        style={{ height: '20px', background: 'var(--win-bg)', borderBottom: '1px solid var(--win-shadow)', fontSize: '11px', padding: '0 2px' }}
      >
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((m) => (
          <button
            key={m}
            className="px-2 py-0 hover:bg-[var(--win-titlebar)] hover:text-white"
            style={{ fontSize: '11px', background: 'transparent', border: 'none', cursor: 'default', height: '18px', borderRadius: 0 }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Win2K Toolbar */}
      <div
        className="shrink-0 flex items-center gap-1 px-1"
        style={{ height: '28px', background: 'var(--win-bg)', borderBottom: '2px solid var(--win-shadow)', boxShadow: 'inset 0 -1px 0 var(--win-light)' }}
      >
        {['◀ Back', '▶ Forward', '↑ Up'].map((t) => (
          <button
            key={t}
            className="win-raised px-2"
            style={{ height: '22px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'default' }}
          >
            {t}
          </button>
        ))}
        <div className="win-separator" style={{ width: '4px', height: '22px', margin: '0 2px' }} />
        {/* Address bar */}
        <span style={{ fontSize: '11px', marginLeft: '4px', marginRight: '4px' }}>Address</span>
        <div
          className="flex-1 flex items-center"
          style={{ height: '20px', background: 'var(--win-white)', border: '1px solid var(--win-shadow)', boxShadow: 'inset 1px 1px 0 var(--win-shadow)', fontSize: '11px', padding: '0 4px' }}
        >
          <span style={{ color: 'var(--win-navy)' }}>C:\Program Files\Some Icons\icons.exe</span>
        </div>
        <button className="win-raised px-2" style={{ height: '20px', fontSize: '11px', cursor: 'default' }}>Go</button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 md:flex-row flex-col">
        {/* Mobile header with hamburger menu */}
        <MobileHeader />

        <Sidebar>
          {/* Logo section */}
          <SidebarHeader className="p-0">
            {/* Sidebar title bar */}
            <div
              className="win-titlebar"
              style={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', marginBottom: '2px' }}
            >
              <img src="/logo.svg" alt="" className="h-3 w-3" style={{ filter: 'invert(1)' }} />
              Icon Controls
            </div>
          </SidebarHeader>

          <SidebarContent className="space-y-3 px-2 py-2">
            {/* Search */}
            <div className="win-groupbox" style={{ paddingTop: '12px' }}>
              <span className="win-groupbox-label">Search</span>
              <SearchInput />
            </div>

            {/* Style control */}
            <div className="win-groupbox" style={{ paddingTop: '12px' }}>
              <span className="win-groupbox-label">Style</span>
              <StyleToggle />
            </div>

            {/* Category control */}
            <div className="win-groupbox" style={{ paddingTop: '12px' }}>
              <span className="win-groupbox-label">Category</span>
              <CategorySelect />
            </div>

            {/* Customize section */}
            <div className="win-groupbox" style={{ paddingTop: '12px' }}>
              <span className="win-groupbox-label">Customize</span>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Color:</label>
                <ColorPicker />
              </div>
            </div>

            {/* Download section */}
            <div className="win-groupbox" style={{ paddingTop: '12px' }}>
              <span className="win-groupbox-label">Download</span>
              <div style={{ marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Size:</label>
                <SizeSelector />
              </div>
              <div style={{ marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Format:</label>
                <FormatSelector />
              </div>
              <div className="space-y-1">
                <ExportButton />
                {count > 0 && (
                  <div className="flex gap-1 items-center">
                    <SegmentedButton
                      onClick={handleSelectAll}
                      isActive={false}
                      variant="secondary"
                      tint="blue"
                      textString="Select all"
                      className="win-raised !rounded-none"
                      style={{ fontFamily: "'Tahoma',sans-serif", fontSize: '11px' }}
                    />
                    <SegmentedButton
                      onClick={handleDeselect}
                      isActive={false}
                      variant="secondary"
                      tint="red"
                      textString="Deselect"
                      className="win-raised !rounded-none"
                      style={{ fontFamily: "'Tahoma',sans-serif", fontSize: '11px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </SidebarContent>

          {/* Footer with theme toggle and version */}
          <SidebarFooter className="px-2 py-1" style={{ borderTop: '2px solid var(--win-shadow)', boxShadow: 'inset 0 1px 0 var(--win-light)' }}>
            <ThemeToggle />
            {version && (
              <Link
                to="/changelog"
                style={{ fontSize: '11px', color: 'var(--win-navy)', textDecoration: 'underline' }}
              >
                v{version}
              </Link>
            )}
          </SidebarFooter>
        </Sidebar>

        <MainContent>
          <ScrollArea>
            <IconGrid />
          </ScrollArea>
          <Footer />
        </MainContent>
      </div>

      {/* Win2K Status Bar */}
      <div className="win-statusbar shrink-0">
        <div className="win-statusbar-panel flex-1">
          {filteredIcons.length} object(s)
        </div>
        <div className="win-statusbar-panel" style={{ minWidth: '80px' }}>
          {count > 0 ? `${count} selected` : 'Ready'}
        </div>
        <div style={{ width: '16px', height: '16px', flexShrink: 0 }}>
          {/* Resize grip */}
          <svg viewBox="0 0 16 16" width="16" height="16"><path d="M10 10L16 16M6 10L16 20M12 6L22 16" stroke="var(--win-shadow)" strokeWidth="1"/></svg>
        </div>
      </div>
    </div>
  )
}
