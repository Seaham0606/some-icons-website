"use client"

/**
 * InputSection — Figma node 56:5302.
 * Pass `leadSlot` with e.g. `<SomeIcon iconName="…" iconSize="2xs" />` (12×12 label icon).
 */

import * as React from "react"
import { cn } from "../../utils"

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
  /** Label-row lead (typically `<SomeIcon iconSize="2xs" … />`). */
  leadSlot?: React.ReactNode
  showContentSlot?: boolean
  contentSlot?: React.ReactNode
  /**
   * Sets `color` on the lead wrapper so `SomeIcon` / SVG `currentColor` tints. Omit to inherit.
   * Example: `"var(--color-intent-accent)"`.
   */
  leadColor?: React.CSSProperties["color"]
}

export function InputSection({
  className,
  showLabel = true,
  label = "",
  leadSlot,
  showContentSlot = true,
  contentSlot,
  leadColor,
}: InputSectionProps) {
  const showLead = showLabel && leadSlot != null

  return (
    <div className={cn("ds-inputSection", className)} data-component="input-section">
      {showLabel ? (
        <div className="ds-inputSection__labelRow" data-part="label-row">
          {showLead ? (
            <div
              className="ds-inputSection__lead"
              data-part="lead"
              style={leadColor != null ? { color: leadColor } : undefined}
            >
              {leadSlot}
            </div>
          ) : null}
          <div className="ds-inputSection__title" data-part="title">
            {label}
          </div>
        </div>
      ) : null}
      {showContentSlot ? (
        <div className="ds-inputSection__content" data-part="content">
          {contentSlot ?? <InputSectionSlotPlaceholder />}
        </div>
      ) : null}
    </div>
  )
}
