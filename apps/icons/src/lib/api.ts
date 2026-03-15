import { CDN_BASE_URL } from './constants'
import type { IconIndex } from '@/types/icon'
import type { ChangelogIndex } from '@/types/changelog'

export async function fetchIconIndex(): Promise<IconIndex> {
  const response = await fetch(`${CDN_BASE_URL}index.json`, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch icon index')
  }
  return response.json()
}

export async function fetchSvg(path: string): Promise<string> {
  const response = await fetch(`${CDN_BASE_URL}${path}`, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Failed to fetch SVG: ${path}`)
  }
  return response.text()
}

export async function fetchChangelogIndex(): Promise<ChangelogIndex> {
  const response = await fetch('/assets/js/changelog-index.json', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Failed to fetch changelog')
  }
  return response.json()
}
