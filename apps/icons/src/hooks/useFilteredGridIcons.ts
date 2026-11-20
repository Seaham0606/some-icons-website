import { useMemo } from 'react'
import { useIcons } from '@/hooks/useIcons'
import { useFilterStore } from '@/stores/filterStore'
import type { Icon } from '@/types/icon'

function normalizeQuery(s: string): string {
  return s.trim().toLowerCase()
}

function matches(icon: Icon, query: string): boolean {
  const q = normalizeQuery(query)
  if (!q) return true

  const searchableText = [icon.id, icon.category, ...(icon.tags ?? [])]
    .join(' ')
    .toLowerCase()

  return q.split(/\s+/).every((term) => searchableText.includes(term))
}

/**
 * Icons currently shown in the home grid (same filters + sort as `IconGrid`).
 */
export function useFilteredGridIcons(): Icon[] {
  const { data: icons } = useIcons()
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const category = useFilterStore((state) => state.category)
  const style = useFilterStore((state) => state.style)

  return useMemo(() => {
    if (!icons) return []

    let result = icons

    if (category !== 'all') {
      result = result.filter((icon) => icon.category === category)
    }

    if (searchQuery) {
      result = result.filter((icon) => matches(icon, searchQuery))
    }

    result = result.filter((icon) => icon.files[style])

    result = [...result].sort((a, b) => a.id.localeCompare(b.id))

    return result
  }, [icons, searchQuery, category, style])
}
