/**
 * Maps filter/category slugs (from the icon index `icon.category` field, plus synthetic `all`)
 * to CDN icon names for UI (dropdown rows, trigger leading icon).
 *
 * Edit the record below when new categories ship; see `category-icons.md`.
 */
export const CATEGORY_ICONS: Record<string, string> = {
  all: 'grid',
  arrow: 'arrow-up-right-circle',
  commerce: 'shopping-bag-alt',
  chat: 'message',
  content: 'book-alt',
  device: 'phone',
  file: 'file',
  formatting: 'pen-alt',
  gesture: 'point-4-finger-alt',
  interface: 'home',
  map: 'map-alt',
  media: 'play',
  symbol: 'shape-spade',
  time: 'clock-05',
  weather: 'cloud',
}

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? 'information-circle'
}

export function getCategoryLabel(cat: string): string {
  return cat === 'all' ? 'All icons' : cat.charAt(0).toUpperCase() + cat.slice(1)
}
