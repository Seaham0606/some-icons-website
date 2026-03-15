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
