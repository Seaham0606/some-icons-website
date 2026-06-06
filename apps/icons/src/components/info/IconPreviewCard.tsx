import { ActionChip } from '@/components/info/ActionChip'
import { IconWireframe } from '@/components/info/IconWireframe'
import type { Icon } from '@/types/icon'
import { Chip, InputSection } from 'design-system'
import { cn } from '@/lib/utils'

export interface IconPreviewCardProps {
  icon: Icon
  exportSize?: number | null
  selectionCount: number
  selectionCategoryLabel: string
  selectedIcons?: Icon[]
  isDownloading: boolean
  onDownload: () => void
  className?: string
}

export function IconPreviewCard({
  icon,
  exportSize,
  selectionCount,
  selectionCategoryLabel,
  selectedIcons,
  isDownloading,
  onDownload,
  className,
}: IconPreviewCardProps) {
  return (
    <InputSection
      className={cn('homepage-infoPanelShellPreview', className)}
      showLabel={false}
      contentSlot={
        <div
          className="homepage-infoPanelWireframeShell"
          data-slot="infoPanel-preview-shell"
          role="group"
          aria-label={
            selectionCount > 1
              ? `${selectionCount} icons selected`
              : exportSize != null && exportSize > 0
                ? `${icon.id}, ${icon.category}, ${exportSize} by ${exportSize} pixel export`
                : `${icon.id}, ${icon.category}`
          }
        >
          <IconWireframe
            icon={icon}
            displaySize={selectionCount <= 1 ? (exportSize ?? undefined) : undefined}
            selectedIcons={selectedIcons}
          />

          <div
            className="homepage-infoPanelWireframeOverlay homepage-infoPanelWireframeOverlay--token"
            data-slot="infoPanel-meta-token"
          >
            <Chip variant="accent" backdropBlur>
              {selectionCount > 1 ? `${selectionCount} icons selected` : icon.id}
            </Chip>
          </div>

          <div
            className="homepage-infoPanelWireframeOverlay homepage-infoPanelWireframeOverlay--category"
            data-slot="infoPanel-meta-category"
          >
            <Chip variant="neutral" backdropBlur>
              {selectionCategoryLabel}
            </Chip>
          </div>

          <ActionChip
            data-slot="infoPanel-download-chip"
            busy={isDownloading}
            selectionCount={selectionCount}
            onDownload={onDownload}
          />
        </div>
      }
    />
  )
}
