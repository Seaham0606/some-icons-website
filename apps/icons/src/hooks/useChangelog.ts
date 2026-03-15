import { useQuery } from '@tanstack/react-query'
import { fetchChangelogIndex } from '@/lib/api'
import type { ChangelogEntry } from '@/types/changelog'

export function useChangelog() {
  return useQuery({
    queryKey: ['changelog'],
    queryFn: fetchChangelogIndex,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => data.entries,
  })
}

/** Derives latest version from changelog entries */
export function getLatestVersion(entries: ChangelogEntry[] | undefined): string | undefined {
  if (!entries || entries.length === 0) return undefined

  let latestEntry = entries[0]
  let latestDate = 0

  for (const entry of entries) {
    if (entry.date) {
      const date = new Date(entry.date).getTime()
      if (!isNaN(date) && date > latestDate) {
        latestDate = date
        latestEntry = entry
      }
    }
  }

  return latestEntry.version
}
