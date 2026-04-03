import { create } from 'zustand'

interface SelectionState {
  selectedIds: Set<string>
  /**
   * True while the bulk-action session is open (any selection or explicit keep after
   * “deselect all visible” from the select-all control). Ends when count hits 0 from
   * per-card deselect/toggle, or when `clear()` runs — except `deselectMany(..., {
   * keepBulkSessionWhenEmpty: true })` preserves the session at 0 for that control only.
   */
  bulkSessionActive: boolean
  toggle: (id: string) => void
  select: (id: string) => void
  deselect: (id: string) => void
  deselectMany: (
    ids: string[],
    options?: { keepBulkSessionWhenEmpty?: boolean },
  ) => void
  selectAll: (ids: string[]) => void
  clear: () => void
  isSelected: (id: string) => boolean
  count: number
}

function withBulkSessionAfterCountChange<T extends { count: number }>(
  state: SelectionState,
  next: T,
  options?: { keepBulkSessionWhenEmpty?: boolean },
): T & { bulkSessionActive: boolean } {
  if (next.count > 0) {
    return { ...next, bulkSessionActive: true }
  }
  if (options?.keepBulkSessionWhenEmpty === true) {
    return { ...next, bulkSessionActive: state.bulkSessionActive }
  }
  return { ...next, bulkSessionActive: false }
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),
  count: 0,
  bulkSessionActive: false,
  toggle: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return withBulkSessionAfterCountChange(
        state,
        {
          selectedIds: next,
          count: next.size,
        },
      )
    }),
  select: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      next.add(id)
      return withBulkSessionAfterCountChange(
        state,
        {
          selectedIds: next,
          count: next.size,
        },
      )
    }),
  deselect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      next.delete(id)
      return withBulkSessionAfterCountChange(
        state,
        {
          selectedIds: next,
          count: next.size,
        },
      )
    }),
  deselectMany: (ids, opts) =>
    set((state) => {
      const next = new Set(state.selectedIds)
      for (const id of ids) {
        next.delete(id)
      }
      return withBulkSessionAfterCountChange(
        state,
        {
          selectedIds: next,
          count: next.size,
        },
        opts,
      )
    }),
  selectAll: (ids) =>
    set((state) => {
      const next = new Set(ids)
      return withBulkSessionAfterCountChange(
        state,
        {
          selectedIds: next,
          count: next.size,
        },
      )
    }),
  clear: () =>
    set({
      selectedIds: new Set(),
      count: 0,
      bulkSessionActive: false,
    }),
  isSelected: (id) => get().selectedIds.has(id),
}))
