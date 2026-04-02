import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
  className?: string
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main
      className={cn(
        'flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative',
        className
      )}
      style={{ background: 'var(--win-bg)' }}
    >
      {/* Win2K toolbar area divider at top */}
      <div
        style={{
          height: '2px',
          background: 'transparent',
          boxShadow: 'inset 0 1px 0 var(--win-shadow), inset 0 2px 0 var(--win-light)',
          flexShrink: 0,
        }}
      />
      {/* Sunken content area */}
      <div
        className="flex-1 flex flex-col min-h-0 mx-2 my-2 overflow-hidden"
        style={{
          boxShadow: 'inset 1px 1px 0 var(--win-shadow), inset -1px -1px 0 var(--win-light), inset 2px 2px 0 var(--win-dark-shadow), inset -2px -2px 0 var(--win-hilight)',
          background: 'var(--win-white)',
        }}
      >
        {children}
      </div>
    </main>
  )
}

interface ScrollAreaProps {
  children: ReactNode
  className?: string
}

export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto', className)} style={{ background: 'var(--win-white)' }}>
      {children}
    </div>
  )
}
