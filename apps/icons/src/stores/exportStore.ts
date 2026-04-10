import { create } from 'zustand'
import {
  DEFAULT_ICON_SIZE,
  type AssetExportFormat,
  type CopyExportFormat,
  type ExportFormat,
} from '@/lib/constants'

interface ExportState {
  size: number | null
  /**
   * When set, grid previews use `--icon-preview-user-px`. When null, previews use layout cap only
   * (export `size` may still be set, e.g. default 24 for export before the user picks a display size).
   */
  gridPreviewPx: number | null
  /** What “Copy” produces — independent of download file type. */
  copyFormat: CopyExportFormat
  /** ZIP / file download artifact type — independent of copy snippet format. */
  downloadFormat: AssetExportFormat
  showValidationErrors: boolean
  setSize: (size: number | null) => void
  setCopyFormat: (format: CopyExportFormat) => void
  setDownloadFormat: (format: AssetExportFormat) => void
  /**
   * Batch update (SVG sets both copy+download to SVG; PNG / Code adjust one axis). Kept for callers that
   * mirrored the old single “Format” control.
   */
  setFormat: (format: ExportFormat | null) => void
  setShowValidationErrors: (show: boolean) => void
  isValid: () => boolean
  validate: () => { sizeValid: boolean; formatValid: boolean }
}

export const useExportStore = create<ExportState>((set, get) => ({
  size: DEFAULT_ICON_SIZE,
  gridPreviewPx: null,
  copyFormat: 'svg',
  downloadFormat: 'svg',
  showValidationErrors: false,
  setSize: (size) =>
    set({
      size,
      showValidationErrors: false,
      gridPreviewPx: size != null && size > 0 ? size : null,
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
  setDownloadFormat: (downloadFormat) =>
    set({ downloadFormat, showValidationErrors: false }),
  setFormat: (format) =>
    set((state) => {
      if (format === null) {
        return {
          copyFormat: 'svg',
          downloadFormat: 'svg',
          showValidationErrors: false,
        }
      }
      if (format === 'svg') {
        return {
          copyFormat: 'svg',
          downloadFormat: 'svg',
          showValidationErrors: false,
        }
      }
      if (format === 'png') {
        return { downloadFormat: 'png', showValidationErrors: false }
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
    return state.size !== null && state.size > 0
  },
  validate: () => {
    const state = get()
    return {
      sizeValid: state.size !== null && state.size > 0,
      formatValid: true,
    }
  },
}))
