import { create } from 'zustand'
import type { IconStyle } from '@/types/icon'

interface FilterState {
  searchQuery: string
  category: string
  style: IconStyle
  setSearchQuery: (query: string) => void
  setCategory: (category: string) => void
  setStyle: (style: IconStyle) => void
  reset: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  category: 'all',
  style: 'outline',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setStyle: (style) => set({ style }),
  reset: () => set({ searchQuery: '', category: 'all', style: 'outline' }),
}))
