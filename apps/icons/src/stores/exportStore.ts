import { create } from 'zustand'
import { DEFAULT_ICON_SIZE, type ExportFormat } from '@/lib/constants'

interface ExportState {
  size: number | null
  /**
   * When set, grid previews use `--icon-preview-user-px`. When null, previews use layout cap only
   * (export `size` may still be set, e.g. default 24 for export before the user picks a display size).
   */
  gridPreviewPx: number | null
  format: ExportFormat | null
  showValidationErrors: boolean
  setSize: (size: number | null) => void
  setFormat: (format: ExportFormat | null) => void
  setShowValidationErrors: (show: boolean) => void
  isValid: () => boolean
  validate: () => { sizeValid: boolean; formatValid: boolean }
}

export const useExportStore = create<ExportState>((set, get) => ({
  size: DEFAULT_ICON_SIZE,
  gridPreviewPx: null,
  format: 'svg',
  showValidationErrors: false,
  setSize: (size) =>
    set({
      size,
      showValidationErrors: false,
      gridPreviewPx: size != null && size > 0 ? size : null,
    }),
  setFormat: (format) =>
    set((state) => ({
      format,
      showValidationErrors: false,
      size:
        format === 'code' && state.size === null
          ? DEFAULT_ICON_SIZE
          : state.size,
    })),
  setShowValidationErrors: (show) => set({ showValidationErrors: show }),
  isValid: () => {
    const state = get()
    if (state.format === null) return false
    return state.size !== null && state.size > 0
  },
  validate: () => {
    const state = get()
    return {
      sizeValid: state.size !== null && state.size > 0,
      formatValid: state.format !== null,
    }
  },
}))
