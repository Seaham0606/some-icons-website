import { IconCard } from './IconCard'
import { useFilteredGridIcons } from '@/hooks/useFilteredGridIcons'
import { useIcons } from '@/hooks/useIcons'
import { IconGrid as IconGridUI } from 'design-system'
import type { Icon } from '@/types/icon'

interface IconGridProps {
  /** Extra bottom padding when a bottom gradient overlay is shown (px). */
  gradientOverlayInsetPx?: number
  onInfoOpen?: (icon: Icon) => void
  infoPanelOpen?: boolean
  /** Icon id whose card stays highlighted while the info panel is open. */
  infoPanelTargetId?: string | null
  onInfoPanelClose?: () => void
}

export function IconGrid({
  gradientOverlayInsetPx = 0,
  onInfoOpen,
  onInfoPanelClose,
  infoPanelOpen = false,
  infoPanelTargetId = null,
}: IconGridProps) {
  const { isLoading, error } = useIcons()
  const filteredIcons = useFilteredGridIcons()

  return (
    <IconGridUI
      className="homepage-iconGrid"
      isLoading={isLoading}
      hasError={!!error}
      isEmpty={!isLoading && !error && filteredIcons.length === 0}
      paddingBottomPx={gradientOverlayInsetPx}
    >
      {filteredIcons.map((icon) => (
        <IconCard
          key={icon.id}
          icon={icon}
          onInfoOpen={onInfoOpen}
          onInfoPanelClose={onInfoPanelClose}
          infoPanelOpen={infoPanelOpen}
          infoPanelActive={
            infoPanelOpen && infoPanelTargetId != null && infoPanelTargetId === icon.id
          }
        />
      ))}
    </IconGridUI>
  )
}
