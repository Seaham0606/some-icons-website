import { Button, SomeIcon } from 'design-system'

export interface IconInfoPanelHeaderProps {
  onClose: () => void
}

/** Top row modeled on SiteHeader: title cluster + trailing dismiss only (no logo, chip, theme). */
export function IconInfoPanelHeader({ onClose }: IconInfoPanelHeaderProps) {
  return (
    <div className="ds-siteHeader__topSlot">
      <div className="ds-siteHeader__leftSlot">
        <div className="ds-siteHeader__title">Icon details</div>
      </div>
      <div className="ds-siteHeader__rightSlot">
        <Button
          type="button"
          variant="transparent"
          size="md"
          radius="md"
          aria-label="Close"
          onClick={onClose}
          leadingSlot={
            <SomeIcon
              iconName="multiply"
              iconStyle="outline"
              iconSize="md"
              padding="0"
              color="var(--color-main-tertiary)"
            />
          }
        />
      </div>
    </div>
  )
}
