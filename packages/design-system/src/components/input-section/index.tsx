"use client"

/**
 * InputSection — Figma node 56:5302.
 * Pass `leadingSlot` with e.g. `<SomeIcon iconName="…" iconSize="2xs" />` (12×12 label icon).
 */

import * as React from "react"
import { cn } from "../../utils"
import { SomeIcon } from "../some-icon"

/** Figma default empty state for the content region (node 115:8535). */
export function InputSectionSlotPlaceholder() {
  return (
    <div
      className="ds-inputSection__slotPlaceholder"
      data-part="slot-placeholder"
      aria-hidden
    />
  )
}

export interface InputSectionProps {
  className?: string
  showLabel?: boolean
  label?: string
  /** Label-row leading (typically `<SomeIcon iconSize="2xs" … />`). */
  leadingSlot?: React.ReactNode
  /**
   * Label-row trailing; same chrome as `leadingSlot` (e.g. `SomeIcon` `iconSize="2xs"`).
   * Ignored when `collapsible` is true (preset expand/collapse control is used instead).
   */
  trailingSlot?: React.ReactNode
  /** When `false`, the content region (and `contentSlot`) is not rendered. @default true */
  hasContentSlot?: boolean
  /**
   * When true, section body toggles open/closed; the full label row is clickable. Trailing
   * shows `interface-expand` / `interface-collapse` (revealed while the pointer is inside the section).
   * @default false
   */
  collapsible?: boolean
  /** Controlled expanded state (pair with `onExpandedChange`). */
  expanded?: boolean
  /** Uncontrolled initial expanded state when `expanded` is omitted. @default true */
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  contentSlot?: React.ReactNode
  /**
   * Sets `color` on the leading wrapper so `SomeIcon` / SVG `currentColor` tints. Omit to inherit.
   * Example: `"var(--color-intent-accent)"`.
   */
  leadingColor?: React.CSSProperties["color"]
  /** Same as `leadingColor` for the trailing wrapper (not applied to the preset collapsible icons). */
  trailingColor?: React.CSSProperties["color"]
}

export function InputSection({
  className,
  showLabel = true,
  label = "",
  leadingSlot,
  trailingSlot,
  hasContentSlot = true,
  collapsible = false,
  expanded: expandedProp,
  defaultExpanded = true,
  onExpandedChange,
  contentSlot,
  leadingColor,
  trailingColor,
}: InputSectionProps) {
  const [expandedUncontrolled, setExpandedUncontrolled] =
    React.useState(defaultExpanded)
  const expanded =
    expandedProp !== undefined ? expandedProp : expandedUncontrolled
  const setExpanded = React.useCallback(
    (next: boolean) => {
      if (expandedProp === undefined) {
        setExpandedUncontrolled(next)
      }
      onExpandedChange?.(next)
    },
    [expandedProp, onExpandedChange],
  )

  const showLeading = showLabel && leadingSlot != null
  const showCustomTrailing =
    showLabel && !collapsible && trailingSlot != null
  const showCollapsibleTrailing = showLabel && collapsible

  const titleId = React.useId()
  const contentId = React.useId()

  const [pointerInside, setPointerInside] = React.useState(false)

  const collapsibleLabelTail =
    showCollapsibleTrailing ? (
      <div
        className="ds-inputSection__trailing ds-inputSection__trailing--pointerReveal"
        data-part="trailing"
        aria-hidden
      >
        <SomeIcon
          iconName={
            expanded ? "interface-collapse" : "interface-expand"
          }
          iconStyle="outline"
          iconSize="sm"
          padding="050"
          color="var(--color-main-quaternary)"
        />
      </div>
    ) : null

  const customLabelTail = showCustomTrailing ? (
    <div
      className="ds-inputSection__trailing"
      data-part="trailing"
      style={
        trailingColor != null ? { color: trailingColor } : undefined
      }
    >
      {trailingSlot}
    </div>
  ) : null

  const labelRowInside = (
    <>
      {showLeading ? (
        <div
          className="ds-inputSection__leading"
          data-part="leading"
          style={leadingColor != null ? { color: leadingColor } : undefined}
        >
          {leadingSlot}
        </div>
      ) : null}
      <div
        className="ds-inputSection__title"
        data-part="title"
        id={collapsible ? titleId : undefined}
      >
        {label}
      </div>
      {collapsible ? collapsibleLabelTail : customLabelTail}
    </>
  )

  return (
    <div
      className={cn(
        "ds-inputSection",
        collapsible && "ds-inputSection--collapsible",
        className,
      )}
      data-component="input-section"
      data-expanded={collapsible ? (expanded ? "true" : "false") : undefined}
      data-trailing-revealed={
        collapsible && pointerInside ? "true" : undefined
      }
      onPointerEnter={
        collapsible
          ? () => {
              setPointerInside(true)
            }
          : undefined
      }
      onPointerLeave={
        collapsible
          ? () => {
              setPointerInside(false)
            }
          : undefined
      }
    >
      {showLabel ? (
        collapsible ? (
          <button
            type="button"
            className="ds-inputSection__labelRow ds-inputSection__labelRow--toggle"
            data-part="label-row"
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded(!expanded)}
          >
            {labelRowInside}
          </button>
        ) : (
          <div
            className="ds-inputSection__labelRow"
            data-part="label-row"
          >
            {labelRowInside}
          </div>
        )
      ) : null}
      {collapsible && hasContentSlot ? (
        <div
          className="ds-inputSection__collapsiblePanel"
          data-part="collapsible-panel"
          aria-hidden={expanded ? undefined : true}
        >
          <div className="ds-inputSection__panelMotion">
            <div
              className="ds-inputSection__content"
              data-part="content"
              id={contentId}
              role="region"
              aria-labelledby={titleId}
            >
              {contentSlot ?? <InputSectionSlotPlaceholder />}
            </div>
          </div>
        </div>
      ) : !collapsible && hasContentSlot ? (
        <div className="ds-inputSection__content" data-part="content">
          {contentSlot ?? <InputSectionSlotPlaceholder />}
        </div>
      ) : null}
    </div>
  )
}
