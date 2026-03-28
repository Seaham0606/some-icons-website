import { LazyIconPreview } from './LazyIconPreview'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useColorStore } from '@/stores/colorStore'
import { useClipboard } from '@/hooks/useClipboard'
import { useSvgFetch } from '@/hooks/useSvgFetch'
import { applyColorToSvg, ensureViewBox } from '@/lib/svg-utils'
import { IconCard as IconCardUI } from 'design-system'
import type { Icon } from '@/types/icon'
import { useState, useEffect, useRef, memo } from 'react'

interface IconCardProps {
  icon: Icon
}

export const IconCard = memo(function IconCard({ icon }: IconCardProps) {
  const style = useFilterStore((state) => state.style)
  const selectedColor = useColorStore((state) => state.selectedColor)
  const isSelected = useSelectionStore((state) => state.selectedIds.has(icon.id))
  const toggle = useSelectionStore((state) => state.toggle)
  const { copy } = useClipboard()
  const { data: svg } = useSvgFetch(icon.files[style])

  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  /** Subscribed only while copy tooltip is open so we hide it if multi-select starts elsewhere. */
  const [selectionActiveWhileTooltip, setSelectionActiveWhileTooltip] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!showTooltip) {
      setSelectionActiveWhileTooltip(false)
      return
    }
    setSelectionActiveWhileTooltip(useSelectionStore.getState().count > 0)
    return useSelectionStore.subscribe((s) => {
      setSelectionActiveWhileTooltip(s.count > 0)
    })
  }, [showTooltip])

  useEffect(() => {
    if (showTooltip) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(false)
      }, 3000)

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
    /* Avoid subscribing every card to `count` — any change would re-render the whole grid. */
    if (useSelectionStore.getState().count > 0) {
      toggle(icon.id)
      return
    }

    if (!svg) return

    let processedSvg = ensureViewBox(svg)
    if (selectedColor) {
      processedSvg = applyColorToSvg(processedSvg, selectedColor)
    } else {
      processedSvg = processedSvg
        .replace(/(fill\s*=\s*["']?)(#?[0-9a-fA-F]{3,6})(["']?)/gi, '$1currentColor$3')
        .replace(/(stroke\s*=\s*["']?)(#?[0-9a-fA-F]{3,6})(["']?)/gi, '$1currentColor$3')
    }

    const success = await copy(processedSvg)

    if (success && useSelectionStore.getState().count === 0) {
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

  return (
    <IconCardUI
      title={icon.id}
      selected={isSelected}
      previewSlot={
        <LazyIconPreview path={icon.files[style]} />
      }
      onPrimaryClick={handleCardClick}
      onSelectionToggleClick={() => toggle(icon.id)}
      copyFeedbackOpen={showTooltip && !selectionActiveWhileTooltip}
      copyFeedbackPosition={tooltipPosition}
      onMouseLeave={handleMouseLeave}
    />
  )
})
