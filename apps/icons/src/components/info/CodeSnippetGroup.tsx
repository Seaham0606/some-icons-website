import { BULK_COPY_STATE_ICONS } from '@/lib/bulk-copy-state-icons'
import { cn } from '@/lib/utils'
import { Button, ChipButton, InputField } from 'design-system'
import type { ReactNode } from 'react'

// ---------------------------------------------------------------------------
// CodeSnippet — individual label + copy button + code body block
// ---------------------------------------------------------------------------

export interface CodeSnippetProps {
  label: string
  /** When true the copy button renders in its "copied" success state. */
  copied?: boolean
  onCopy?: () => void
  copyAriaLabel?: string
  copyDisabled?: boolean
  /** Code body — typically a ReactSnippetLazy / SvgSnippetLazy or a <pre>. */
  children: ReactNode
  'data-slot'?: string
  className?: string
  /**
   * Optional slot rendered between the label and the copy button in the
   * snippet header — use to embed an inline tab strip (e.g. package manager
   * or import-mode switcher).
   */
  headerTabsSlot?: ReactNode
}

export function CodeSnippet({
  label,
  copied = false,
  onCopy,
  copyAriaLabel,
  copyDisabled = false,
  children,
  'data-slot': dataSlot,
  className,
  headerTabsSlot,
}: CodeSnippetProps) {
  return (
    <div
      className={cn('homepage-infoPanelContent__snippetBlock', className)}
      data-slot={dataSlot}
    >
      <div className="homepage-infoPanelContent__snippetBlockHead">
        <span className="homepage-infoPanelContent__snippetBlockLabel">{label}</span>
        {headerTabsSlot}
        {onCopy != null && (
          <Button
            type="button"
            variant="transparent"
            size="sm"
            radius="md"
            className="homepage-infoPanelContent__snippetBlockCopy"
            contentColor="var(--color-main-tertiary)"
            aria-label={copyAriaLabel ?? (copied ? `Copied ${label}` : `Copy ${label}`)}
            stateIcons={BULK_COPY_STATE_ICONS}
            stripActiveIndex={copied ? 1 : 0}
            stripActiveBackground="var(--color-overlay-success)"
            stripIconSize="xs"
            disabled={copyDisabled}
            onClick={onCopy}
          />
        )}
      </div>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CodeSnippetGroup — tab bar (chip tabs) + panel
// ---------------------------------------------------------------------------

export interface SnippetTab {
  id: string
  label: string
  disabled?: boolean
  /** Shown inline after this tab (e.g. install info next to "React"). */
  trailingSlot?: ReactNode
}

export interface CodeSnippetGroupProps {
  tabs: SnippetTab[]
  activeTab: string
  onTabChange: (id: string) => void
  /** One or more <CodeSnippet> elements rendered inside the active tab panel. */
  contentSlot: ReactNode
  /** Label row caption (left). @default "Code" */
  label?: string
  className?: string
}

export function CodeSnippetGroup({
  tabs,
  activeTab,
  onTabChange,
  contentSlot,
  label = 'Code',
  className,
}: CodeSnippetGroupProps) {
  return (
    <div data-slot="infoPanel-snippet-section">
      <InputField
        className={cn('homepage-infoPanelContent__snippetSection', className)}
        label={label}
        labelTrailingSlot={
          <div
            className="homepage-infoPanelContent__snippetTabBar"
            role="tablist"
            aria-label={`${label} format`}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <ChipButton
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  disabled={tab.disabled}
                  className="homepage-codeSnippetTab"
                  labelSize="md"
                  compoundShell
                  variant={isActive ? 'strong' : 'transparent'}
                  trailingSlot={isActive ? tab.trailingSlot : undefined}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </ChipButton>
              )
            })}
          </div>
        }
        contentSlot={
          <div
            className="homepage-infoPanelContent__snippetTabPanel"
            role="tabpanel"
          >
            {contentSlot}
          </div>
        }
      />
    </div>
  )
}
