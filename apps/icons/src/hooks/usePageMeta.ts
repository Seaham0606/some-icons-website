import { useEffect } from 'react'
import {
  getCanonicalUrl,
  OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const canonical = getCanonicalUrl(meta.path)
    const ogType = meta.ogType ?? 'website'

    document.title = meta.title

    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', OG_IMAGE)
    setMeta('property', 'og:image:secure_url', OG_IMAGE)
    setMeta('property', 'og:image:type', OG_IMAGE_TYPE)
    setMeta('property', 'og:image:width', String(OG_IMAGE_WIDTH))
    setMeta('property', 'og:image:height', String(OG_IMAGE_HEIGHT))
    setMeta('property', 'og:image:alt', OG_IMAGE_ALT)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', meta.title)
    setMeta('name', 'twitter:description', meta.description)
    setMeta('name', 'twitter:image', OG_IMAGE)
    setMeta('name', 'twitter:image:alt', OG_IMAGE_ALT)

    setLink('canonical', canonical)
  }, [meta.description, meta.ogType, meta.path, meta.title])
}
