import { useQuery } from '@tanstack/react-query'
import { fetchSvg } from '@/lib/api'

export function useSvgFetch(path: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['svg', path],
    queryFn: () => fetchSvg(path!),
    enabled: enabled && !!path,
    staleTime: Infinity, // SVGs don't change
    gcTime: 1000 * 60 * 60, // 1 hour cache
  })
}
