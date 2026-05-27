import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from 'design-system'

export interface ActionChipProps
  extends Omit<
    ButtonProps,
    'variant' | 'size' | 'radius' | 'iconName' | 'iconStyle' | 'children' | 'onClick'
  > {
  busy?: boolean
  selectionCount?: number
  onDownload: () => void
}

export function ActionChip({
  busy = false,
  selectionCount = 1,
  onDownload,
  className,
  ...rest
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
      className={cn(
        'homepage-infoPanelWireframeOverlay homepage-infoPanelWireframeOverlay--download',
        className,
      )}
      aria-busy={busy || undefined}
      aria-label={
        selectionCount > 1
          ? 'Download selected icons as ZIP archive'
          : 'Download as SVG'
      }
      onClick={onDownload}
      {...rest}
    >
      {label}
    </Button>
  )
}
