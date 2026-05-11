import { LazyIconPreview } from './LazyIconPreview'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useSvgFetch } from '@/hooks/useSvgFetch'
import { IconCard as IconCardUI } from 'design-system'
import type { Icon } from '@/types/icon'
import { useEffect, memo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { fetchSvg } from '@/lib/api'

interface IconCardProps {
  icon: Icon
}

/** File segment of a path without extension (e.g. CDN SVG path → basename). */
function basenameWithoutExtension(path: string): string {
  const segment = path.split(/[/\\]/).pop() ?? path
  return segment.replace(/\.[^.]+$/, '')
}

export const IconCard = memo(function IconCard({ icon }: IconCardProps) {
  const style = useFilterStore((state) => state.style)
  const isSelected = useSelectionStore((state) => state.selectedIds.has(icon.id))
  const toggle = useSelectionStore((state) => state.toggle)
  const queryClient = useQueryClient()
  const activeFilePath = icon.files[style]
  const { data: svg } = useSvgFetch(activeFilePath)
  const hoverFilenameLabel =
    activeFilePath != null && activeFilePath !== ''
      ? basenameWithoutExtension(activeFilePath)
      : undefined

  useEffect(() => {
    if (!svg) return
    const altPath = style === 'outline' ? icon.files.filled : icon.files.outline
    if (!altPath) return
    void queryClient.prefetchQuery({
      queryKey: ['svg', altPath],
      queryFn: () => fetchSvg(altPath),
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60,
    })
  }, [svg, style, icon.files.filled, icon.files.outline, queryClient])

  const handleCardClick = () => {
    const sel = useSelectionStore.getState()
    if (sel.count > 0) {
      toggle(icon.id)
    }
  }

  return (
    <IconCardUI
      aria-label={icon.id}
      hoverFilenameLabel={hoverFilenameLabel}
      selected={isSelected}
      previewSlot={
        <LazyIconPreview path={icon.files[style]} />
      }
      onPrimaryClick={handleCardClick}
      onSelectionToggleClick={() => toggle(icon.id)}
    />
  )
})
