import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'w-80 shrink-0 bg-background-secondary',
        'flex flex-col h-full overflow-hidden',
        'max-md:w-full max-md:h-auto max-md:max-h-none',
        className
      )}
    >
      {children}
    </aside>
  )
}

interface SidebarHeaderProps {
  children: ReactNode
  className?: string
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div className={cn('px-6 pt-10 pb-4', className)}>
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
    <div className={cn('flex-1 overflow-y-auto px-6 py-6', className)}>
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

