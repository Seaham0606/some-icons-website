"use client"

import { useId, type ReactNode } from 'react'
import { Button } from '../button'
import { Input } from '../input'
import { InputField } from '../input-field'
import { SomeIcon } from '../some-icon'
import { cn } from '../../utils'

/**
 * Top shell: brand + inline/expandable search + actions.
 *
 * **Structure** (`layout`): `full` (laptop/desktop), `compact` (tablet), `minimal` (mobile). Omit for
 * breakpoint-driven chrome using `ds-siteHeader-*Only` + app `@media` aligned with `--breakpoint-*`.
 *
 * **Content width** (`contentLayout`): laptop/desktop share the same JSX; use `contained` for a centered
 * max-width track at the lg frame, or `fluid` for full width with horizontal padding from the shell.
 */
export interface SiteHeaderProps {
  className?: string
  /**
   * Structural chrome variant. When set, forces that variant at all viewports (e.g. Storybook).
   * When omitted, tablet/mobile/desktop follow design-system `@media` at 720px and 1024px.
   */
  layout?: 'full' | 'compact' | 'minimal'
  /**
   * Horizontal content track at laptop/desktop widths. Tablet/mobile use the same shell padding;
   * `contained` caps the inner row width to `--layout-site-header-content-max`.
   */
  contentLayout?: 'contained' | 'fluid'
  logo: ReactNode
  /** Primary label next to the logo (e.g. site or page title). */
  title: ReactNode
  chipSlot?: ReactNode
  searchQuery: string
  onSearchChange: (value: string) => void
  /** Shown in the tablet inline field and mobile expanded field. */
  searchPlaceholder?: string
  searchAriaLabel?: string
  onSettingsClick: () => void
  settingsAriaLabel?: string
  mobileSearchOpen: boolean
  onMobileSearchToggle: () => void
}

export function SiteHeader({
  className,
  layout,
  contentLayout = 'fluid',
  logo,
  title,
  chipSlot,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchAriaLabel = 'Search',
  onSettingsClick,
  settingsAriaLabel = 'Menu',
  mobileSearchOpen,
  onMobileSearchToggle,
}: SiteHeaderProps) {
  const mobileSearchPanelId = useId()

  return (
    <header
      className={cn('ds-siteHeader', className)}
      {...(layout ? { 'data-layout': layout } : {})}
    >
      <div className="ds-siteHeader__container" data-content-layout={contentLayout}>
        <div className="ds-siteHeader__row">
          <div className="ds-siteHeader__brand">
            {logo}
            <div className="ds-siteHeader__titleBlock">
              <div className="ds-siteHeader__title text-aside-header">{title}</div>
              {chipSlot}
            </div>
          </div>
          <div className="ds-siteHeader__tabletSearch ds-siteHeader-tabletOnly">
            <InputField
              showLabel={false}
              className="ds-siteHeader__searchField"
              contentSlot={
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  aria-label={searchAriaLabel}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  leadingSlot={
                    <SomeIcon
                      iconName="interface-search"
                      iconStyle="outline"
                      iconSize="md"
                      padding="2"
                    />
                  }
                />
              }
            />
          </div>
          <div className="ds-siteHeader__actions">
            <div className="ds-buttonGroup ds-siteHeader-mobileOnly">
              <Button
                type="button"
                variant="transparent"
                size="md"
                radius="lg"
                aria-label={searchAriaLabel}
                aria-expanded={mobileSearchOpen}
                aria-controls={mobileSearchPanelId}
                onClick={() => onMobileSearchToggle()}
                leadingSlot={
                  <SomeIcon
                    iconName="interface-search"
                    iconStyle="outline"
                    iconSize="md"
                    padding="050"
                  />
                }
              />
            </div>
            <Button
              type="button"
              variant="transparent"
              size="md"
              radius="lg"
              aria-label={settingsAriaLabel}
              onClick={onSettingsClick}
              leadingSlot={
                <SomeIcon
                  iconName="interface-settings-nut"
                  iconStyle="outline"
                  iconSize="md"
                  padding="050"
                />
              }
            />
          </div>
        </div>
        {mobileSearchOpen ? (
          <div
            id={mobileSearchPanelId}
            className="ds-siteHeader__mobileSearchPanel ds-siteHeader-mobileOnly"
          >
            <InputField
              showLabel={false}
              contentSlot={
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  autoComplete="off"
                  aria-label={searchAriaLabel}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  leadingSlot={
                    <SomeIcon
                      iconName="interface-search"
                      iconStyle="outline"
                      iconSize="md"
                      padding="2"
                    />
                  }
                />
              }
            />
          </div>
        ) : null}
      </div>
    </header>
  )
}
