import { cn } from '@/lib/utils'
import { Button } from 'design-system'

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
    <Button
      type="button"
      variant="transparent"
      size="sm"
      radius="full"
      disabled={busy}
      iconName="arrow-down-circle"
      iconStyle="outline"
      className={cn('homepage-infoPanelWireframeDownloadChip', className)}
      aria-label={
        selectionCount > 1
          ? 'Download selected icons as ZIP archive'
          : 'Download as SVG'
      }
      onClick={onDownload}
    >
      {label}
    </Button>
  )
}
