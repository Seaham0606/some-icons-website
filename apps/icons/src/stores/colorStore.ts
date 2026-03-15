import { create } from 'zustand'

interface ColorState {
  selectedColor: string | null
  setColor: (color: string | null) => void
  reset: () => void
}

export const useColorStore = create<ColorState>((set) => ({
  selectedColor: null,
  setColor: (color) => set({ selectedColor: color }),
  reset: () => set({ selectedColor: null }),
}))
