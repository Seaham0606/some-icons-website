/**
 * Maps filter/category slugs (from the icon index `icon.category` field, plus synthetic `all`)
 * to CDN icon names for UI (dropdown rows, trigger leading icon).
 *
 * Edit the record below when new categories ship; see `category-icons.md`.
 */
export const CATEGORY_ICONS: Record<string, string> = {
  all: 'interface-grid',
  arrow: 'arrow-up-right-circle',
  commerce: 'commerce-shopping-bag-alt',
  chat: 'chat-message',
  content: 'content-book-alt',
  device: 'device-phone',
  file: 'file-file',
  formatting: 'formatting-pen-alt',
  gesture: 'gesture-point-4-finger-alt',
  interface: 'interface-home',
  map: 'map-map-alt',
  media: 'media-play',
  symbol: 'symbol-shape-spade',
  time: 'time-clock-05',
  weather: 'weather-cloud',
}

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] ?? 'symbol-information-circle'
}

export function getCategoryLabel(cat: string): string {
  return cat === 'all' ? 'All icons' : cat.charAt(0).toUpperCase() + cat.slice(1)
}
