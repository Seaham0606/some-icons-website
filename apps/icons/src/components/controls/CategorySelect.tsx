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
      <div className="flex w-full" style={{ height: '22px' }}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            flex: 1,
            background: 'var(--win-white)',
            border: '1px solid var(--win-shadow)',
            borderRight: 'none',
            boxShadow: 'inset 1px 1px 0 var(--win-shadow)',
            fontSize: '11px',
            fontFamily: "'Tahoma','MS Sans Serif',Arial,sans-serif",
            color: 'var(--win-text)',
            padding: '0 4px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'default',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
          onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
        >
          {getCategoryLabel(category)}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="win-raised"
          style={{
            width: '20px',
            height: '22px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            borderRadius: 0,
          }}
          aria-label="Open category dropdown"
        >
          <CdnIcon 
            iconId="arrow-down-triangle"
            className="h-3 w-3" 
          />
        </button>
      </div>
      <CategoryList isOpen={isOpen} onSelect={handleSelect} onClose={() => setIsOpen(false)} />
    </div>
  )
}
