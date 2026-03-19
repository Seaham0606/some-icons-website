/**
 * Public Some Icons CDN (see repo README / `apps/icons` `CDN_BASE_URL`).
 * Keep in sync with: https://github.com/Seaham0606/some-icons-cdn
 */
export const SOME_ICONS_CDN_BASE_URL =
  "https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/" as const

export function someIconsCdnUrl(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path
  return `${SOME_ICONS_CDN_BASE_URL}${normalized}`
}

export type SomeIconsIconStyle = "outline" | "filled"

/**
 * Relative path to an icon SVG on the Some Icons CDN, e.g.
 * `icon-assets/filled/interface/interface-cursor.svg`.
 * Folder segment matches the first kebab part of `iconId` (same as `category` in `index.json`).
 */
export function someIconsIconAssetPath(
  iconId: string,
  style: SomeIconsIconStyle = "filled",
): string {
  const trimmed = iconId.trim()
  if (!trimmed) {
    throw new Error("someIconsIconAssetPath: iconId must be a non-empty string")
  }
  const category = trimmed.split("-")[0]
  return `icon-assets/${style}/${category}/${trimmed}.svg`
}

export function someIconsIconUrl(
  iconId: string,
  style: SomeIconsIconStyle = "filled",
): string {
  return someIconsCdnUrl(someIconsIconAssetPath(iconId, style))
}

/** Figma default for InputSection lead icon (`interface-cursor`, filled). */
export const INPUT_SECTION_DEFAULT_LEAD_ICON_URL = someIconsIconUrl(
  "interface-cursor",
  "filled",
)
