import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
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
        'md:hidden flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-background',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {showLogo && (
          <img src="/logo.svg" alt="Some Icons" className="h-5 w-auto" />
        )}
        {title && (
          <h1 className="font-semibold text-foreground">{title}</h1>
        )}
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 -mr-2 text-foreground-secondary hover:text-foreground transition-colors"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </header>
  )
}
