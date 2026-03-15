import { create } from 'zustand'
import type { ExportFormat } from '@/lib/constants'

interface ExportState {
  size: number | null
  format: ExportFormat | null
  showValidationErrors: boolean
  setSize: (size: number | null) => void
  setFormat: (format: ExportFormat | null) => void
  setShowValidationErrors: (show: boolean) => void
  isValid: () => boolean
  validate: () => { sizeValid: boolean; formatValid: boolean }
}

export const useExportStore = create<ExportState>((set, get) => ({
  size: null,
  format: null,
  showValidationErrors: false,
  setSize: (size) => set({ size, showValidationErrors: false }),
  setFormat: (format) => set({ format, showValidationErrors: false }),
  setShowValidationErrors: (show) => set({ showValidationErrors: show }),
  isValid: () => {
    const state = get()
    return state.size !== null && state.size > 0 && state.format !== null
  },
  validate: () => {
    const state = get()
    return {
      sizeValid: state.size !== null && state.size > 0,
      formatValid: state.format !== null,
    }
  },
}))
