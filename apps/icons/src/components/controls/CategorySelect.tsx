import { useFilterStore } from '@/stores/filterStore'
import { SomeIcon, nativeInputClassName } from 'design-system'
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
    <div className="ds-selectTriggerWrap" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(nativeInputClassName, 'ds-selectTrigger')}
      >
        <SomeIcon
          iconName={getCategoryIcon(category)}
          iconStyle="outline"
          iconSize="sm"
          className="ds-selectTriggerIcon"
        />
        <span className="ds-selectTriggerLabel">{getCategoryLabel(category)}</span>
      </button>
      <div className="ds-selectTriggerChevron" aria-hidden>
        <SomeIcon
          iconName={isOpen ? 'arrow-up-triangle' : 'arrow-down-triangle'}
          iconStyle="outline"
          iconSize="sm"
          className="ds-selectTriggerChevronIcon"
        />
      </div>
      <CategoryList isOpen={isOpen} onSelect={handleSelect} onClose={() => setIsOpen(false)} />
    </div>
  )
}
