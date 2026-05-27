export const SITE_URL = 'https://someicons.com'
/** Host that serves the built app and static assets (avoids redirect chains for og:image). */
export const ASSET_ORIGIN = 'https://icons.someicons.com'
export const SITE_NAME = 'Some Icons'

export const DEFAULT_TITLE = 'Some Icons — Free SVG Icon Library'
export const DEFAULT_DESCRIPTION =
  'Browse, customize, and download free SVG icons. Search by category, apply custom colors, copy React snippets, and export as SVG or PNG.'

export const OG_IMAGE = `${ASSET_ORIGIN}/assets/images/social-banner.jpg`
export const OG_IMAGE_WIDTH = 1920
export const OG_IMAGE_HEIGHT = 1080
export const OG_IMAGE_ALT =
  'Some Icons — a free SVG icon library with search, color customization, and export tools'
export const OG_IMAGE_TYPE = 'image/jpeg'

export type PageMeta = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article'
}

const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  '/changelog': {
    title: `Changelog — ${SITE_NAME}`,
    description: `Release notes and updates for ${SITE_NAME}, the free SVG icon library.`,
    path: '/changelog',
  },
}

export function getPageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] ?? PAGE_META['/']
}

export function getCanonicalUrl(path: string): string {
  const normalized = path === '/' ? '' : path
  return `${SITE_URL}${normalized}`
}

export const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
} as const
