import { cn } from '@/lib/utils'
import { SomeIcon } from 'design-system'

export interface ActionChipProps {
  busy?: boolean
  selectionCount?: number
  onDownload: () => void
  className?: string
}

export function ActionChip({
  busy = false,
  selectionCount = 1,
  onDownload,
  className,
}: ActionChipProps) {
  const label = selectionCount > 1 ? 'ZIP' : 'SVG'

  return (
    <div
      className={cn('homepage-infoPanelWireframeDownloadChip', className)}
      role="group"
      aria-label="Download assets"
    >
      <button
        type="button"
        className="homepage-infoPanelWireframeDownloadChip__segment homepage-infoPanelWireframeDownloadChip__segment--main"
        disabled={busy}
        aria-label={
          selectionCount > 1
            ? 'Download selected icons as ZIP archive'
            : 'Download as SVG'
        }
        onClick={onDownload}
      >
        <span className="homepage-infoPanelWireframeDownloadChip__segmentInner">
          <SomeIcon
            iconName="arrow-down-circle"
            iconStyle="outline"
            iconSize="xs"
            padding="050"
          />
          <span className="label-3xs homepage-infoPanelWireframeDownloadChip__format">
            {label}
          </span>
        </span>
      </button>
    </div>
  )
}
