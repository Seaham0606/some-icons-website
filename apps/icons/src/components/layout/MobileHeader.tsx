import { useUIStore } from '@/stores/uiStore'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  title?: string
  showLogo?: boolean
  className?: string
}

export function MobileHeader({ title, showLogo = true, className }: MobileHeaderProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header
      className={cn(
        'md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-base)] bg-[var(--color-fill-background-elevation)]',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showLogo && (
          <img src="/logo.svg" alt="Some Icons" className="h-5 w-auto" />
        )}
        {title && (
          <h1 className="font-semibold text-[var(--color-main-primary)]">{title}</h1>
        )}
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 -mr-2 text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        <CdnIcon iconId="arrow-down-triangle" className="h-6 w-6" />
      </button>
    </header>
  )
}
