import { useState, useEffect, useRef } from 'react'
import { IconPreview } from './IconPreview'
import { cn } from '@/lib/utils'

interface LazyIconPreviewProps {
  path: string | undefined
  className?: string
}

/**
 * Lazy loads IconPreview only when it enters the viewport.
 * This significantly improves performance when rendering many icons.
 */
export function LazyIconPreview({ path, className }: LazyIconPreviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    // If IntersectionObserver is not supported, load immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Once visible, we can stop observing
            observer.unobserve(entry.target)
          }
        })
      },
      {
        // Start loading when icon is 100px away from viewport
        rootMargin: '100px',
        threshold: 0.01,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={cn('w-full h-full', className)}>
      {isVisible ? (
        <IconPreview path={path} className="w-full h-full" />
      ) : (
        // Placeholder with same dimensions to prevent layout shift
        <div className="w-full h-full" style={{ backgroundColor: 'transparent' }} />
      )}
    </div>
  )
}
