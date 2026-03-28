import { useMemo, useState, useEffect } from 'react'
import { IconCard } from './IconCard'
import { useIcons } from '@/hooks/useIcons'
import { useFilterStore } from '@/stores/filterStore'
import { IconGrid as IconGridUI } from 'design-system'
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
  const [bottomPadding, setBottomPadding] = useState<number>(32 * 4)

  useEffect(() => {
    const calculatePadding = () => {
      const footer = document.getElementById('main-footer')
      if (footer) {
        const footerHeight = footer.offsetHeight
        setBottomPadding(footerHeight + 24)
      }
    }

    const timeoutId = setTimeout(() => {
      calculatePadding()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(calculatePadding)
    })

    const observeFooter = () => {
      const footer = document.getElementById('main-footer')
      if (footer) {
        resizeObserver.observe(footer)
      } else {
        setTimeout(observeFooter, 100)
      }
    }

    observeFooter()

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

  return (
    <IconGridUI
      isLoading={isLoading}
      hasError={!!error}
      isEmpty={!isLoading && !error && filteredIcons.length === 0}
      paddingBottomPx={bottomPadding}
    >
      {filteredIcons.map((icon) => (
        <IconCard key={icon.id} icon={icon} />
      ))}
    </IconGridUI>
  )
}
