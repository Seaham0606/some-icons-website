import { IconPreview } from './IconPreview'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useColorStore } from '@/stores/colorStore'
import { useClipboard } from '@/hooks/useClipboard'
import { useSvgFetch } from '@/hooks/useSvgFetch'
import { applyColorToSvg, ensureViewBox } from '@/lib/svg-utils'
import { cn } from '@/lib/utils'
import { CdnIcon } from '@/components/ui/cdn-icon'
import type { Icon } from '@/types/icon'
import { useState, useEffect, useRef } from 'react'

interface IconCardProps {
  icon: Icon
}

export function IconCard({ icon }: IconCardProps) {
  const style = useFilterStore((state) => state.style)
  const selectedColor = useColorStore((state) => state.selectedColor)
  const isSelected = useSelectionStore((state) => state.isSelected(icon.id))
  const count = useSelectionStore((state) => state.count)
  const toggle = useSelectionStore((state) => state.toggle)
  const { copy } = useClipboard()
  const { data: svg } = useSvgFetch(icon.files[style])
  const cardRef = useRef<HTMLButtonElement>(null)
  
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isDark, setIsDark] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Check if we're in multiple selection mode (at least one icon is selected)
  const isSelectionMode = count > 0

  // Auto-hide tooltip after 3 seconds and track cursor globally
  useEffect(() => {
    if (showTooltip) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(false)
      }, 3000)

      // Track cursor position globally when tooltip is shown
      const handleGlobalMouseMove = (e: MouseEvent) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY })
      }

      document.addEventListener('mousemove', handleGlobalMouseMove)
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        document.removeEventListener('mousemove', handleGlobalMouseMove)
      }
    }
  }, [showTooltip])

  const handleCardClick = async (e: React.MouseEvent) => {
    // If in selection mode, toggle selection instead of copying
    if (isSelectionMode) {
      toggle(icon.id)
      return
    }

    // Otherwise, copy the SVG
    if (!svg) return
    
    // Apply color to SVG (or use currentColor if none selected)
    let processedSvg = ensureViewBox(svg)
    if (selectedColor) {
      // Apply the selected color - this replaces all colors with the selected color
      processedSvg = applyColorToSvg(processedSvg, selectedColor)
    } else {
      // If no color selected, replace any hex colors with currentColor
      // Preserve 'none', 'transparent', 'inherit', and existing 'currentColor'
      processedSvg = processedSvg
        .replace(/(fill\s*=\s*["']?)(#?[0-9a-fA-F]{3,6})(["']?)/gi, '$1currentColor$3')
        .replace(/(stroke\s*=\s*["']?)(#?[0-9a-fA-F]{3,6})(["']?)/gi, '$1currentColor$3')
    }
    
    const success = await copy(processedSvg)
    
    // Show tooltip only in single select mode and if copy was successful
    if (success && !isSelectionMode) {
      setTooltipPosition({ x: e.clientX, y: e.clientY })
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleRadioClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggle(icon.id)
  }

  return (
    <>
      <button
        ref={cardRef}
        onClick={handleCardClick}
        onMouseLeave={handleMouseLeave}
        title={icon.id}
        className={cn(
          'group relative aspect-square rounded-[10px] transition-all overflow-hidden cursor-pointer',
          'bg-background',
          'border border-border-subtle',
          'hover:bg-background-hover-light hover:border-primary',
          isSelected && 'border-primary'
        )}
      >
      <div className="w-full h-full grid place-items-center p-4">
        <IconPreview path={icon.files[style]} className="w-[60%] h-[60%]" />
      </div>

      {/* Selection indicator - always visible when selected, only on hover when unselected */}
      <button
        onClick={handleRadioClick}
        className={cn(
          'absolute top-1 right-1 w-5 h-5 rounded flex items-center justify-center',
          'transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          'hover:opacity-80'
        )}
        aria-label={isSelected ? 'Deselect icon' : 'Select icon'}
      >
        {isSelected ? (
          <CdnIcon iconId="interface-button-radio-selected" className="w-5 h-5 text-primary" />
        ) : (
          <CdnIcon iconId="interface-button-radio" className="w-5 h-5 text-[var(--item-disabled)]" />
        )}
      </button>
    </button>
      
      {/* Tooltip that follows cursor - only in single select mode */}
      {showTooltip && !isSelectionMode && (
        <div
          className={cn(
            "fixed pointer-events-none z-50 pl-2 pr-4 py-1 rounded-[999px] text-base font-semibold whitespace-nowrap flex items-center gap-1.5 backdrop-blur-[10px]",
            isDark ? "text-white" : "text-black"
          )}
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`,
            backgroundColor: isDark 
              ? 'var(--color-white-alpha-100)' 
              : 'var(--color-black-alpha-100)',
          }}
        >
          <CdnIcon iconId="interface-check-mark" className="w-4 h-4" />
          Copied
        </div>
      )}
    </>
  )
}
