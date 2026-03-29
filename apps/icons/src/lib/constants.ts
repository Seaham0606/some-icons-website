export const CDN_BASE_URL = 'https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/'

export const DEFAULT_ICON_SIZE = 24

// Size presets match the vanilla version
export const SIZE_PRESETS = [16, 20, 24, 32] as const

/** Raster / SVG ZIP export only; `code` uses a separate copy-to-clipboard path. */
export const ASSET_EXPORT_FORMATS = ['svg', 'png'] as const
export type AssetExportFormat = (typeof ASSET_EXPORT_FORMATS)[number]

export const EXPORT_FORMATS = ['svg', 'png', 'code'] as const
export type ExportFormat = (typeof EXPORT_FORMATS)[number]
