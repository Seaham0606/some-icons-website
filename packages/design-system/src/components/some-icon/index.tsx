"use client"

import * as React from "react"
import { cn } from "../../utils"
import { getSomeIconsCdnBaseUrl } from "../../some-icons-cdn-base-url"

/** Matches Some Icons CDN `index.json` shape (minimal). */
export interface SomeIconFile {
  outline?: string
  filled?: string
}

export interface SomeIconEntry {
  id: string
  files: SomeIconFile
}

export interface SomeIconManifest {
  icons: SomeIconEntry[]
}

const indexCache = new Map<string, Promise<SomeIconManifest>>()
const svgCache = new Map<string, Promise<string>>()

function fetchIconIndex(baseUrl: string): Promise<SomeIconManifest> {
  let p = indexCache.get(baseUrl)
  if (!p) {
    p = fetch(`${baseUrl}index.json`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch icon index")
        return r.json() as Promise<SomeIconManifest>
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

export type SomeIconStyle = "outline" | "fill"

/** Maps to `--size-icon-*` in theme tokens. */
export type SomeIconIconSize =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"

/** Maps to `--spacing-*` (excludes `025`). */
export type SomeIconPadding = "0" | "050" | "1" | "2"

const ICON_SIZE_VAR: Record<SomeIconIconSize, string> = {
  "2xs": "var(--size-icon-2xs)",
  xs: "var(--size-icon-xs)",
  sm: "var(--size-icon-sm)",
  md: "var(--size-icon-md)",
  lg: "var(--size-icon-lg)",
  xl: "var(--size-icon-xl)",
  "2xl": "var(--size-icon-2xl)",
}

const PADDING_VAR: Record<SomeIconPadding, string> = {
  "0": "var(--spacing-0)",
  "050": "var(--spacing-050)",
  "1": "var(--spacing-1)",
  "2": "var(--spacing-2)",
}

export interface SomeIconProps {
  /**
   * Icon id from CDN `index.json` (same as SVG basename in asset paths).
   */
  iconName: string
  iconStyle?: SomeIconStyle
  cdnBaseUrl?: string
  className?: string
  /** Sets `color` on the wrapper so `fill`/`stroke="currentColor"` in the SVG resolves correctly. */
  color?: React.CSSProperties["color"]
  /** Glyph size from theme `--size-icon-*`. */
  iconSize: SomeIconIconSize
  /**
   * Inset from theme `--spacing-*` (excluding `025`). Outer width/height =
   * `2 × padding + iconSize`.
   */
  padding?: SomeIconPadding
}

/**
 * Loads an SVG from Some Icons CDN using `index.json` path resolution.
 */
export function SomeIcon({
  iconName,
  iconStyle = "outline",
  cdnBaseUrl,
  className,
  color,
  iconSize,
  padding = "0",
}: SomeIconProps) {
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

  const frameStyle: React.CSSProperties = {
    ...(color != null ? { color } : {}),
    ["--ds-some-icon-pad" as string]: PADDING_VAR[padding],
    ["--ds-some-icon-glyph" as string]: ICON_SIZE_VAR[iconSize],
  }

  return (
    <div
      className={cn("ds-someIcon", className)}
      data-some-icon-size={iconSize}
      data-some-icon-padding={padding}
      style={frameStyle}
    >
      <div
        className="ds-someIcon__glyph"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  )
}
