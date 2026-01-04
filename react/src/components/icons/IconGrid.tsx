import { useMemo, useState, useEffect } from 'react'
import { IconCard } from './IconCard'
import { useIcons } from '@/hooks/useIcons'
import { useFilterStore } from '@/stores/filterStore'
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

export function IconGrid() {
  const { data: icons, isLoading, error } = useIcons()
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const category = useFilterStore((state) => state.category)
  const style = useFilterStore((state) => state.style)
  const [bottomPadding, setBottomPadding] = useState<number>(32 * 4) // Default to pb-32 (128px)

  // Calculate padding based on footer height + 24px
  useEffect(() => {
    const calculatePadding = () => {
      const footer = document.getElementById('main-footer')
      if (footer) {
        const footerHeight = footer.offsetHeight
        setBottomPadding(footerHeight + 24)
      }
    }

    // Calculate on mount with a small delay to ensure footer is rendered
    const timeoutId = setTimeout(() => {
      calculatePadding()
    }, 0)

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculatePadding)
    })
    
    // Try to observe footer, retry if not available
    const observeFooter = () => {
      const footer = document.getElementById('main-footer')
      if (footer) {
        resizeObserver.observe(footer)
      } else {
        // Retry after a short delay if footer not found
        setTimeout(observeFooter, 100)
      }
    }
    
    observeFooter()

    // Also listen to window resize as fallback
    window.addEventListener('resize', calculatePadding)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculatePadding)
    }
  }, [])

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

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center h-64 text-foreground-secondary"
        style={{ paddingBottom: `${bottomPadding}px` }}
      >
        Loading icons...
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className="flex items-center justify-center h-64 text-destructive"
        style={{ paddingBottom: `${bottomPadding}px` }}
      >
        Failed to load icons. Please try again.
      </div>
    )
  }

  if (filteredIcons.length === 0) {
    return (
      <div 
        className="flex items-center justify-center h-64 text-foreground-secondary"
        style={{ paddingBottom: `${bottomPadding}px` }}
      >
        No icons found matching your criteria.
      </div>
    )
  }

  return (
    <div 
      className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2 sm:gap-3 p-4 sm:p-6 content-start"
      style={{ paddingBottom: `${bottomPadding}px` }}
    >
      {filteredIcons.map((icon) => (
        <IconCard key={icon.id} icon={icon} />
      ))}
    </div>
  )
}
