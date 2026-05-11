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

function parseSemver(version: string): { major: number; minor: number; patch: number } | null {
  const m = version.trim().match(/^v?(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return null
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) }
}

function compareSemver(
  a: { major: number; minor: number; patch: number },
  b: { major: number; minor: number; patch: number }
): number {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  return a.patch - b.patch
}

/** Derives highest semver (largest number), e.g. v3.0.0 */
export function getHighestVersion(entries: ChangelogEntry[] | undefined): string | undefined {
  if (!entries || entries.length === 0) return undefined

  let best: { major: number; minor: number; patch: number } | null = null
  let bestRaw: string | undefined

  for (const entry of entries) {
    const v = parseSemver(entry.version)
    if (!v) continue
    if (!best || compareSemver(v, best) > 0) {
      best = v
      bestRaw = entry.version
    }
  }

  if (!best) return undefined
  return bestRaw?.startsWith('v') ? bestRaw : `v${bestRaw}`
}
