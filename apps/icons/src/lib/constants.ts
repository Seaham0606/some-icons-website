export const CDN_BASE_URL = 'https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/'

export const DEFAULT_ICON_SIZE = 24

// Size presets match the vanilla version
export const SIZE_PRESETS = [16, 20, 24, 32] as const

/** Raster / SVG ZIP export; `code` copies a snippet (size still comes from export UI). */
export const ASSET_EXPORT_FORMATS = ['svg', 'png'] as const
export type AssetExportFormat = (typeof ASSET_EXPORT_FORMATS)[number]

export const EXPORT_FORMATS = ['svg', 'png', 'code'] as const
export type ExportFormat = (typeof EXPORT_FORMATS)[number]

/** Clipboard export: SVG markup vs React (or other) code snippet — orthogonal to raster download. */
export type CopyExportFormat = Extract<ExportFormat, 'svg' | 'code'>
