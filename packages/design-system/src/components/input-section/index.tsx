"use client"

/**
 * InputSection — Figma node 56:5302.
 * `iconName` must match an `icons[].id` entry in the Some Icons CDN `index.json`.
 */

import * as React from "react"
import { cn } from "../../utils"
import { SomeIcon, type SomeIconStyle } from "../some-icon"

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
  /** When set (including `null`), replaces the CDN icon; omit to use `iconName` + `iconStyle`. */
  leadSlot?: React.ReactNode
  iconName?: string
  iconStyle?: SomeIconStyle
  showContentSlot?: boolean
  contentSlot?: React.ReactNode
  cdnBaseUrl?: string
  /**
   * Sets `color` on the lead wrapper so CDN SVGs (currentColor) tint. Omit to inherit from context.
   * Example: `"var(--color-main-accent)"`.
   */
  leadColor?: React.CSSProperties["color"]
}

export function InputSection({
  className,
  showLabel = true,
  label = "",
  leadSlot,
  iconName,
  iconStyle = "outline",
  showContentSlot = true,
  contentSlot,
  cdnBaseUrl,
  leadColor,
}: InputSectionProps) {
  const useAutoCdnIcon = leadSlot === undefined

  const showLead =
    showLabel &&
    (useAutoCdnIcon ? Boolean(iconName) : leadSlot != null)

  const leadInner = useAutoCdnIcon ? (
    iconName ? (
      <SomeIcon
        iconName={iconName}
        iconStyle={iconStyle}
        cdnBaseUrl={cdnBaseUrl}
        className="ds-inputSection__leadIcon"
        color={leadColor}
      />
    ) : null
  ) : (
    leadSlot
  )

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
              {leadInner}
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
