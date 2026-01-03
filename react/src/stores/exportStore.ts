import { create } from 'zustand'
import type { ExportFormat } from '@/lib/constants'

interface ExportState {
  size: number | null
  format: ExportFormat | null
  setSize: (size: number | null) => void
  setFormat: (format: ExportFormat | null) => void
  isValid: () => boolean
}

export const useExportStore = create<ExportState>((set, get) => ({
  size: null,
  format: null,
  setSize: (size) => set({ size }),
  setFormat: (format) => set({ format }),
  isValid: () => {
    const state = get()
    return state.size !== null && state.size > 0 && state.format !== null
  },
}))
