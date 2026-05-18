"use client"

import { useId, type ReactNode } from 'react'
import { Input } from '../input'
import { InputField } from '../input-field'
import { SomeIcon } from '../some-icon'
import { cn } from '../../utils'

export type SiteHeaderChromeContext = {
  /** Pass to mobile search `aria-controls` / panel `id`. */
  mobileSearchPanelId: string
  /** Pass to header settings `aria-controls` / settings row `id`. */
  settingsRowPanelId: string
}

/**
 * Top shell: left cluster (logo, title, chip) + app-composed `rightSlot`, bottom strip below laptop
 * (settings row + optional expanded mobile search). Bottom panels use the same grid + panel motion
 * pattern as collapsible `InputSection` (see `.ds-inputSection__collapsiblePanel` / `__panelMotion`).
 *
 * **Structure** (`layout`): `full` (laptop/desktop), `compact` (tablet), `minimal` (mobile). Omit for
 * breakpoint-driven chrome using `ds-siteHeader-*Only` + app `@media` aligned with `--breakpoint-*`.
 *
 * **Content width** (`contentLayout`): use `contained` for a centered max-width track at the lg frame,
 * or `fluid` for full width with horizontal padding from the shell.
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
  /** Primary label next to the logo (string or rich text). */
  title: ReactNode
  chipSlot?: ReactNode
  /**
   * Right side of the top row (tablet search, mobile search toggle, settings, etc.).
   * Use the function form to receive panel ids for `aria-controls` / `aria-expanded` wiring.
   */
  rightSlot: ReactNode | ((ctx: SiteHeaderChromeContext) => ReactNode)
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  searchAriaLabel?: string
  /** Expanded mobile search field in the bottom strip (hidden by default; mobile breakpoint). */
  mobileSearchOpen: boolean
  /**
   * When true, shows the settings row in the bottom strip (tablet / mobile only, hidden by default).
   */
  settingsRowOpen: boolean
  /** Content for `.ds-siteHeader__settings` when `settingsRowOpen`. Omit for empty placeholder. */
  settingsBottomSlot?: ReactNode
}

export function SiteHeader({
  className,
  layout,
  contentLayout = 'fluid',
  logo,
  title,
  chipSlot,
  rightSlot,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchAriaLabel = 'Search',
  mobileSearchOpen,
  settingsRowOpen,
  settingsBottomSlot,
}: SiteHeaderProps) {
  const mobileSearchPanelId = useId()
  const settingsRowPanelId = useId()

  const resolvedRightSlot =
    typeof rightSlot === 'function'
      ? rightSlot({ mobileSearchPanelId, settingsRowPanelId })
      : rightSlot

  const showBottomChrome = mobileSearchOpen || settingsRowOpen

  return (
    <header
      className={cn('ds-siteHeader', className)}
      {...(layout ? { 'data-layout': layout } : {})}
    >
      <div className="ds-siteHeader__container" data-content-layout={contentLayout}>
        <div className="ds-siteHeader__topSlot">
          <div className="ds-siteHeader__leftSlot">
            {logo}
            <div className="ds-siteHeader__title">{title}</div>
            {chipSlot}
          </div>
          <div className="ds-siteHeader__rightSlot">{resolvedRightSlot}</div>
        </div>
        <div
          className="ds-siteHeader__bottomSlot ds-siteHeader-belowLaptopOnly"
          data-chrome-open={showBottomChrome ? 'true' : 'false'}
        >
          <div
            className="ds-siteHeader__collapsiblePanel"
            data-part="settings-panel"
            data-expanded={settingsRowOpen ? 'true' : 'false'}
            aria-hidden={settingsRowOpen ? undefined : true}
          >
            <div
              className="ds-siteHeader__panelMotion"
              {...(!settingsRowOpen ? { inert: true } : {})}
            >
              <div id={settingsRowPanelId} className="ds-siteHeader__settings">
                {settingsBottomSlot ?? (
                  <div
                    className="ds-siteHeader__settingsPlaceholder"
                    aria-hidden
                  />
                )}
              </div>
            </div>
          </div>
          <div
            className="ds-siteHeader__collapsiblePanel ds-siteHeader__collapsiblePanel--search ds-siteHeader-mobileOnly"
            data-part="search-panel"
            data-expanded={mobileSearchOpen ? 'true' : 'false'}
            aria-hidden={mobileSearchOpen ? undefined : true}
          >
            <div
              className="ds-siteHeader__panelMotion"
              {...(!mobileSearchOpen ? { inert: true } : {})}
            >
              <div
                id={mobileSearchPanelId}
                className="ds-siteHeader__mobileSearchPanel"
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
                      trailingSlot={
                        searchQuery.length > 0 ? (
                          <button
                            type="button"
                            className="ds-input__trailingAction"
                            aria-label="Clear search"
                            onMouseDown={(e) => {
                              e.preventDefault()
                            }}
                            onClick={() => {
                              onSearchChange('')
                            }}
                          >
                            <SomeIcon
                              iconName="symbol-multiply"
                              iconStyle="outline"
                              iconSize="sm"
                              padding="050"
                              color="var(--color-main-quaternary)"
                            />
                          </button>
                        ) : undefined
                      }
                    />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
