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
import { Button } from '@/components/ui/button'
import { IconGrid } from '@/components/icons/IconGrid'
import { useChangelog, getLatestVersion } from '@/hooks/useChangelog'
import { useIcons } from '@/hooks/useIcons'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useMemo } from 'react'
import type { Icon } from '@/types/icon'

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
    <div className="flex flex-col h-dvh md:flex-row">
      {/* Mobile header with hamburger menu */}
      <MobileHeader />

      <Sidebar>
        {/* Logo section - centered like vanilla */}
        <SidebarHeader className="flex justify-center">
          <img
            src="/logo.svg"
            alt="Some Icons"
            className="h-6 w-auto"
          />
        </SidebarHeader>

        <SidebarContent className="space-y-5">
          {/* Search */}
          <div>
            <SearchInput />
          </div>

          {/* Style control */}
          <div>
            <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
              Style
            </label>
            <StyleToggle />
          </div>

          {/* Category control */}
          <div>
            <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
              Category
            </label>
            <CategorySelect />
          </div>

          {/* Customize section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Customize
            </h3>
            <div>
              <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
                Color
              </label>
              <ColorPicker />
            </div>
          </div>

          {/* Download section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Download
            </h3>
            <div>
              <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
                Size
              </label>
              <SizeSelector />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
                Format
              </label>
              <FormatSelector />
            </div>
            <ExportButton />
            {count > 0 && (
              <div className="flex justify-between items-center px-0.5">
                <Button
                  onClick={handleSelectAll}
                  variant="link"
                  className="text-base font-semibold text-[var(--primary)]"
                >
                  Select all
                </Button>
                <Button
                  onClick={handleDeselect}
                  variant="link"
                  className="text-base font-semibold text-[var(--color-warning)]"
                >
                  Deselect
                </Button>
              </div>
            )}
          </div>
        </SidebarContent>

        {/* Footer with theme toggle and version */}
        <SidebarFooter>
          <ThemeToggle />
          {version && (
            <span className="text-[var(--foreground-quaternary)]">
              v{version}
            </span>
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
  )
}
