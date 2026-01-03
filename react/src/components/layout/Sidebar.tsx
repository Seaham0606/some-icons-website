import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen, setSidebarOpen])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Desktop: always visible
          'hidden md:flex w-80 shrink-0 bg-background-secondary flex-col h-full overflow-hidden',
          // Mobile: slide-in overlay
          'max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-80 max-md:transform max-md:transition-transform max-md:duration-300',
          sidebarOpen ? 'max-md:flex max-md:translate-x-0' : 'max-md:translate-x-[-100%]',
          className
        )}
      >
        {children}
      </aside>
    </>
  )
}

interface SidebarHeaderProps {
  children: ReactNode
  className?: string
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div className={cn('px-6 pt-10 pb-4 max-md:pt-6', className)}>
      {children}
    </div>
  )
}

interface SidebarContentProps {
  children: ReactNode
  className?: string
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto px-6 py-6 max-md:py-4', className)}>
      {children}
    </div>
  )
}

interface SidebarFooterProps {
  children: ReactNode
  className?: string
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        'mt-auto px-6 py-4 flex items-center justify-between shrink-0',
        className
      )}
    >
      {children}
    </div>
  )
}
