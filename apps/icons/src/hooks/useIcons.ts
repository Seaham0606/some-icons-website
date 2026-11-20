import { useQuery } from '@tanstack/react-query'
import { fetchIconIndex } from '@/lib/api'
import type { Icon } from '@/types/icon'

export function useIcons() {
  return useQuery({
    queryKey: ['icons'],
    queryFn: fetchIconIndex,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    select: (data) => data.icons as Icon[],
  })
}

/** Extracts and sorts unique categories from icons */
export function getCategories(icons: Icon[] | undefined): string[] {
  if (!icons) return []
  const categories = [...new Set(icons.map((icon) => icon.category))]
  return categories.sort((a, b) => a.localeCompare(b))
}

/** Returns a map of category → icon count. The key `"all"` holds the total. */
export function getCategoryCounts(
  icons: Icon[] | undefined,
): Record<string, number> {
  if (!icons) return {}
  const counts: Record<string, number> = { all: icons.length }
  for (const icon of icons) {
    counts[icon.category] = (counts[icon.category] ?? 0) + 1
  }
  return counts
}
