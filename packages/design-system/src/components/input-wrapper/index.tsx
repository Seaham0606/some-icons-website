"use client"

/**
 * InputWrapper — Figma **InputWrapper** (80:5593): label (80:5582) + contentSlot (81:5595).
 * Pass controls via `contentSlot` (SegmentedControl, Input, input groups, etc.).
 */

import * as React from "react"
import { cn } from "../../utils"
import { InputSectionSlotPlaceholder } from "../input-section"

export interface InputWrapperProps {
  className?: string
  /**
   * When `false`, the label row is hidden (e.g. search with no caption).
   * When `true` (default), the row shows if `label` is a non-empty string or any other node.
   */
  showLabel?: boolean
  /** Shown above `contentSlot` when `showLabel` is true. */
  label?: React.ReactNode
  showContentSlot?: boolean
  /** Main control area; default empty state matches InputSection slot placeholder (Figma 115:8535). */
  contentSlot?: React.ReactNode
}

export function InputWrapper({
  className,
  showLabel = true,
  label,
  showContentSlot = true,
  contentSlot,
}: InputWrapperProps) {
  const showLabelRow =
    showLabel && label != null && !(typeof label === "string" && label === "")

  return (
    <div
      className={cn("ds-inputWrapper", className)}
      data-component="input-wrapper"
    >
      {showLabelRow ? (
        <div className="ds-inputWrapper__labelRow" data-part="label-row">
          <span className="ds-inputWrapper__label label-xs" data-part="label">
            {label}
          </span>
        </div>
      ) : null}
      {showContentSlot ? (
        <div className="ds-inputWrapper__content" data-part="content">
          {contentSlot ?? <InputSectionSlotPlaceholder />}
        </div>
      ) : null}
    </div>
  )
}
