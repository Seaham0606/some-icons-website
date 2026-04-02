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
        'md:hidden flex items-center justify-between px-2 win-titlebar',
        className
      )}
      style={{ height: '22px', flexShrink: 0 }}
    >
      <div className="flex items-center gap-2">
        {showLogo && (
          <img src="/logo.svg" alt="Some Icons" className="h-3 w-auto" style={{ filter: 'invert(1)' }} />
        )}
        {title && (
          <h1 style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>{title}</h1>
        )}
        {!title && <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>Some Icons</span>}
      </div>
      <button
        onClick={toggleSidebar}
        className="win-raised"
        style={{ width: '18px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        <CdnIcon iconId="arrow-down-triangle" className="h-3 w-3" />
      </button>
    </header>
  )
}
