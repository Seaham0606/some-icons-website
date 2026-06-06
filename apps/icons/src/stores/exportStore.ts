import { create } from 'zustand'
import {
  DEFAULT_ICON_SIZE,
  type CopyExportFormat,
  type ExportFormat,
} from '@/lib/constants'

interface ExportState {
  size: number | null
  /** What "Copy" produces — independent of download file type. */
  copyFormat: CopyExportFormat
  showValidationErrors: boolean
  setSize: (size: number | null) => void
  setCopyFormat: (format: CopyExportFormat) => void
  /**
   * Batch update (SVG sets copy to SVG; Code sets copy to React). Kept for callers that mirrored the old
   * single "Format" control.
   */
  setFormat: (format: ExportFormat | null) => void
  setShowValidationErrors: (show: boolean) => void
  isValid: () => boolean
  validate: () => { sizeValid: boolean; formatValid: boolean }
}

export const useExportStore = create<ExportState>((set, get) => ({
  size: null,
  copyFormat: 'svg',
  showValidationErrors: false,
  setSize: (size) =>
    set({
      size,
      showValidationErrors: false,
    }),
  setCopyFormat: (copyFormat) =>
    set({
      copyFormat,
      showValidationErrors: false,
      size:
        copyFormat === 'code' && get().size === null
          ? DEFAULT_ICON_SIZE
          : get().size,
    }),
  setFormat: (format) =>
    set((state) => {
      if (format === null || format === 'svg') {
        return {
          copyFormat: 'svg',
          showValidationErrors: false,
        }
      }
      return {
        copyFormat: 'code',
        showValidationErrors: false,
        size:
          state.size === null ? DEFAULT_ICON_SIZE : state.size,
      }
    }),
  setShowValidationErrors: (show) => set({ showValidationErrors: show }),
  isValid: () => {
    const state = get()
    // null means "use default 24px" — always valid; only reject explicit zero/negative values
    return state.size === null || state.size > 0
  },
  validate: () => {
    const state = get()
    return {
      sizeValid: state.size === null || state.size > 0,
      formatValid: true,
    }
  },
}))
