import { create } from 'zustand'

interface SelectionState {
  selectedIds: Set<string>
  toggle: (id: string) => void
  select: (id: string) => void
  deselect: (id: string) => void
  selectAll: (ids: string[]) => void
  clear: () => void
  isSelected: (id: string) => boolean
  count: number
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),
  count: 0,
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { selectedIds: next, count: next.size }
    }),
  select: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      next.add(id)
      return { selectedIds: next, count: next.size }
    }),
  deselect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      next.delete(id)
      return { selectedIds: next, count: next.size }
    }),
  selectAll: (ids) =>
    set(() => {
      const next = new Set(ids)
      return { selectedIds: next, count: next.size }
    }),
  clear: () => set({ selectedIds: new Set(), count: 0 }),
  isSelected: (id) => get().selectedIds.has(id),
}))
