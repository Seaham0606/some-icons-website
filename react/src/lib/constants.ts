export const CDN_BASE_URL = 'https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/'

export const DEFAULT_ICON_SIZE = 24

// Size presets match the vanilla version
export const SIZE_PRESETS = [16, 20, 24, 32] as const

export const EXPORT_FORMATS = ['svg', 'png'] as const

export type ExportFormat = typeof EXPORT_FORMATS[number]
