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
import { IconGrid } from '@/components/icons/IconGrid'
import { useChangelog, getLatestVersion } from '@/hooks/useChangelog'

export default function HomePage() {
  const { data: entries } = useChangelog()
  const version = getLatestVersion(entries)

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
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--item-tertiary)] pl-0.5">
              Style
            </label>
            <StyleToggle />
          </div>

          {/* Category control */}
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[var(--item-tertiary)] pl-0.5">
              Category
            </label>
            <CategorySelect />
          </div>

          {/* Customize section */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Customize
            </h3>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[var(--item-tertiary)] pl-0.5">
                Color
              </label>
              <ColorPicker />
            </div>
          </div>

          {/* Export section */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Export
            </h3>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[var(--item-tertiary)] pl-0.5">
                Icon size
              </label>
              <SizeSelector />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[var(--item-tertiary)] pl-0.5">
                File format
              </label>
              <FormatSelector />
            </div>
            <ExportButton />
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
