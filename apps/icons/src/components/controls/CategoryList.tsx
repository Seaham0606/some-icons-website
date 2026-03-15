import { useFilterStore } from '@/stores/filterStore'
import { useIcons, getCategories } from '@/hooks/useIcons'
import { cn } from '@/lib/utils'
import { SegmentedButton } from '@/components/ui/segmented-control'
import React, { useState, useEffect, useRef } from 'react'

interface CategoryListProps {
  isOpen: boolean
  onSelect: (category: string) => void
  onClose?: () => void
  className?: string
}

// Category to icon mapping
export const CATEGORY_ICONS: Record<string, string> = {
  all: 'interface-grid',
  arrow: 'arrow-up-right-circle',
  commerce: 'commerce-shopping-bag-alt',
  chat: 'chat-message',
  content: 'content-book-alt',
  device: 'device-phone',
  file: 'file-file',
  formatting: 'formatting-pen-alt',
  gesture: 'gesture-point-4-finger-alt',
  interface: 'interface-home',
  map: 'map-map-alt',
  media: 'media-play',
  symbol: 'symbol-shape-spade',
  time: 'time-clock-05',
  weather: 'weather-cloud',
}

// Get icon for a category, fallback to placeholder if not found
export const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category] || 'symbol-information-circle'
}

export function CategoryList({ isOpen, onSelect, onClose, className }: CategoryListProps) {
  const { data: icons } = useIcons()
  const categories = getCategories(icons)
  const category = useFilterStore((state) => state.category)
  const [hasSelection, setHasSelection] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedButtonRef = useRef<HTMLDivElement>(null)

  // Check theme
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(theme === 'dark' || (!theme && prefersDark))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', checkTheme)
    }
  }, [])

  // Reset selection state when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHasSelection(false)
    }
  }, [isOpen])

  // Scroll selected category into view when dropdown opens
  useEffect(() => {
    if (isOpen && selectedButtonRef.current && containerRef.current) {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        const container = containerRef.current
        const selected = selectedButtonRef.current
        if (container && selected) {
          // Get the selected element's offset from the top of the scrollable content
          const selectedOffsetTop = selected.offsetTop
          
          // Scroll to position with 4px offset upward from top edge
          // offsetTop is relative to the scrollable content area (after padding)
          container.scrollTo({
            top: selectedOffsetTop - 4,
            behavior: 'smooth'
          })
        }
      }, 0)
    }
  }, [isOpen, category])

  if (!isOpen) return null

  const allCategories = ['all', ...categories]

  const handleSelect = (selectedCategory: string) => {
    onSelect(selectedCategory)
    setHasSelection(true)
  }

  const handleMouseLeave = () => {
    if (hasSelection && onClose) {
      onClose()
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute top-full left-0 mt-2 z-50',
        'min-w-[272px] w-auto',
        'max-h-[320px] overflow-y-auto',
        'rounded-[10px]',
        'border border-[var(--color-input-stroke)]',
        'bg-[var(--color-input-bg)]',
        'p-1',
        'transition-[border-color]',
        'hover:border-[var(--color-input-stroke-hover)]',
        className
      )}
      style={{
        boxShadow: isDark
          ? `
            0px 100px 80px 0px rgba(0, 0, 0, 0.28),
            0px 42px 33px 0px rgba(0, 0, 0, 0.20),
            0px 23px 18px 0px rgba(0, 0, 0, 0.18),
            0px 13px 10px 0px rgba(0, 0, 0, 0.14),
            0px 7px 6px 0px rgba(0, 0, 0, 0.16),
            0px 4px 2px 0px rgba(0, 0, 0, 0.08)
          `
          : `
            0px 100px 80px 0px rgba(0, 0, 0, 0.07),
            0px 42px 33px 0px rgba(0, 0, 0, 0.05),
            0px 23px 18px 0px rgba(0, 0, 0, 0.045),
            0px 13px 10px 0px rgba(0, 0, 0, 0.035),
            0px 7px 6px 0px rgba(0, 0, 0, 0.04),
            0px 4px 2px 0px rgba(0, 0, 0, 0.02)
          `
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-1 w-full">
        {allCategories.map((cat, index) => (
          <React.Fragment key={cat}>
            <div
              ref={category === cat ? selectedButtonRef : null}
            >
              <SegmentedButton
                isActive={category === cat}
                onClick={() => handleSelect(cat)}
                leadingIcon={getCategoryIcon(cat)}
                textString={cat === 'all' ? 'All icons' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                className="!w-full !flex-none h-[44px] !justify-start"
                iconStyle="outline"
              />
            </div>
            {index === 0 && (
              <div className="h-px mx-1.5 rounded-full bg-[var(--color-divider-stroke)]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
