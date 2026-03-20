import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PageContentProps {
  children?: ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn('homepage-pageContent', className)}>{children}</div>
  )
}
