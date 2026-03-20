"use client"

import * as React from "react"
import { getSomeIconsCdnBaseUrl } from "../../some-icons-cdn-base-url"

/** Matches Some Icons CDN `index.json` shape (minimal). */
export interface SomeIconsCdnIconFile {
  outline?: string
  filled?: string
}

export interface SomeIconsCdnIconEntry {
  id: string
  files: SomeIconsCdnIconFile
}

export interface SomeIconsCdnIconIndex {
  icons: SomeIconsCdnIconEntry[]
}

const indexCache = new Map<string, Promise<SomeIconsCdnIconIndex>>()
const svgCache = new Map<string, Promise<string>>()

function fetchIconIndex(baseUrl: string): Promise<SomeIconsCdnIconIndex> {
  let p = indexCache.get(baseUrl)
  if (!p) {
    p = fetch(`${baseUrl}index.json`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch icon index")
        return r.json() as Promise<SomeIconsCdnIconIndex>
      })
      .catch((e) => {
        indexCache.delete(baseUrl)
        throw e
      })
    indexCache.set(baseUrl, p)
  }
  return p
}

function fetchSvg(baseUrl: string, path: string): Promise<string> {
  const key = `${baseUrl}|${path}`
  let p = svgCache.get(key)
  if (!p) {
    p = fetch(`${baseUrl}${path}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch SVG: ${path}`)
        return r.text()
      })
      .catch((e) => {
        svgCache.delete(key)
        throw e
      })
    svgCache.set(key, p)
  }
  return p
}

function normalizeSvgMarkup(svg: string): string {
  let out = svg
  if (!/\bviewBox=/i.test(out)) {
    out = out.replace(/<svg/i, "<svg viewBox=\"0 0 24 24\"")
  }
  out = out.replace(/fill="([^"]*)"/gi, (_, v: string) =>
    v.toLowerCase() === "none" ? `fill="${v}"` : 'fill="currentColor"'
  )
  out = out.replace(/stroke="([^"]*)"/gi, (_, v: string) =>
    v.toLowerCase() === "none" ? `stroke="${v}"` : 'stroke="currentColor"'
  )
  out = out.replace(
    /<svg([^>]*)>/i,
    "<svg$1 style=\"width: 100%; height: 100%; display: block; color: inherit;\">"
  )
  return out
}

export type SomeIconsCdnIconStyle = "outline" | "fill"

export interface SomeIconsCdnIconProps {
  /**
   * Icon id from CDN `index.json` (same as SVG basename in asset paths).
   */
  iconName: string
  iconStyle?: SomeIconsCdnIconStyle
  cdnBaseUrl?: string
  className?: string
  /** Sets `color` on the wrapper so `fill`/`stroke="currentColor"` in the SVG resolves correctly. */
  color?: React.CSSProperties["color"]
}

/**
 * Loads an SVG from Some Icons CDN using `index.json` path resolution.
 */
export function SomeIconsCdnIcon({
  iconName,
  iconStyle = "outline",
  cdnBaseUrl,
  className,
  color,
}: SomeIconsCdnIconProps) {
  const [markup, setMarkup] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    const raw = cdnBaseUrl ?? getSomeIconsCdnBaseUrl()
    const base = raw.endsWith("/") ? raw : `${raw}/`
    if (!base || !iconName) {
      setMarkup(null)
      return
    }

    const fileKey = iconStyle === "fill" ? "filled" : "outline"

    ;(async () => {
      try {
        const index = await fetchIconIndex(base)
        const icon = index.icons.find((i) => i.id === iconName)
        const path = icon?.files?.[fileKey]
        if (!path || cancelled) {
          if (!cancelled) setMarkup(null)
          return
        }
        const raw = await fetchSvg(base, path)
        if (!cancelled) setMarkup(normalizeSvgMarkup(raw))
      } catch {
        if (!cancelled) setMarkup(null)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [iconName, iconStyle, cdnBaseUrl])

  if (!markup) {
    return null
  }

  return (
    <div
      className={className}
      style={color != null ? { color } : undefined}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
