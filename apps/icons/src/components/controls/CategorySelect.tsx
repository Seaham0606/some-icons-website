import { useFilterStore } from '@/stores/filterStore'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { inputBaseStyles } from '@/components/ui/input'
import { CategoryList, getCategoryIcon } from './CategoryList'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

export function CategorySelect() {
  const category = useFilterStore((state) => state.category)
  const setCategory = useFilterStore((state) => state.setCategory)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getCategoryLabel = (cat: string) => {
    return cat === 'all' ? 'All icons' : cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (selectedCategory: string) => {
    setCategory(selectedCategory)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          inputBaseStyles,
          "pr-[40px] cursor-pointer text-left",
          "flex items-center gap-2"
        )}
      >
        <CdnIcon 
          iconId={getCategoryIcon(category)} 
          style="outline"
          className="h-5 w-5 shrink-0 text-[var(--color-text-primary)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]" 
        />
        <span className="transition-all duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]">{getCategoryLabel(category)}</span>
      </button>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center pointer-events-none text-[var(--color-text-tertiary)]">
        <CdnIcon 
          iconId={isOpen ? "arrow-up-triangle" : "arrow-down-triangle"} 
          className="h-5 w-5" 
        />
      </div>
      <CategoryList isOpen={isOpen} onSelect={handleSelect} onClose={() => setIsOpen(false)} />
    </div>
  )
}
