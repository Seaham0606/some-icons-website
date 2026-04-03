import { useMemo, type CSSProperties } from 'react'
import { IconCard } from './IconCard'
import { useExportStore } from '@/stores/exportStore'
import { useFilteredGridIcons } from '@/hooks/useFilteredGridIcons'
import { useIcons } from '@/hooks/useIcons'
import { IconGrid as IconGridUI } from 'design-system'

interface IconGridProps {
  /** Extra bottom padding when a bottom gradient overlay is shown (px). */
  gradientOverlayInsetPx?: number
}

export function IconGrid({ gradientOverlayInsetPx = 0 }: IconGridProps) {
  const { isLoading, error } = useIcons()
  const filteredIcons = useFilteredGridIcons()
  const gridPreviewPx = useExportStore((s) => s.gridPreviewPx)

  const gridStyle = useMemo((): CSSProperties => {
    if (gridPreviewPx == null) return {}
    return {
      '--icon-preview-user-px': `${gridPreviewPx}px`,
    } as CSSProperties
  }, [gridPreviewPx])

  return (
    <IconGridUI
      isLoading={isLoading}
      hasError={!!error}
      isEmpty={!isLoading && !error && filteredIcons.length === 0}
      paddingBottomPx={gradientOverlayInsetPx}
      style={gridStyle}
    >
      {filteredIcons.map((icon) => (
        <IconCard key={icon.id} icon={icon} />
      ))}
    </IconGridUI>
  )
}
