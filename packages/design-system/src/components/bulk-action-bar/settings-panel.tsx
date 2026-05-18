"use client"

/**
 * Bulk action bar export settings — Figma InputSection variant (node 1199:8185):
 * “Copy as” row built from {@link DropdownOption} + shell tokens.
 */

import * as React from "react"
import { cn } from "../../utils"
import { DropdownOption } from "../dropdown/dropdown-option"

export type BulkActionBarCopyFormat = "svg" | "code"

export interface BulkActionBarSettingsPanelProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  copyFormat: BulkActionBarCopyFormat
  onCopyFormatChange: (format: BulkActionBarCopyFormat) => void
  /**
   * Disables “Copy as SVG” (e.g. multi-select: only React copy is available in product rules).
   */
  disableCopySvg?: boolean
}

export function BulkActionBarSettingsPanel({
  copyFormat,
  onCopyFormatChange,
  disableCopySvg = false,
  className,
  role = "region",
  "aria-label": ariaLabel = "Bulk export format",
  ...props
}: BulkActionBarSettingsPanelProps) {
  return (
    <div
      className={cn("ds-bulkActionBarSettingsPanel", className)}
      data-component="bulk-action-bar-settings-panel"
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="ds-bulkActionBarSettingsPanel__body">
        <div
          className="ds-bulkActionBarSettingsPanel__section"
          role="group"
          aria-label="Copy as"
        >
          <div className="ds-bulkActionBarSettingsPanel__sectionLabel">Copy as:</div>
          <div className="ds-bulkActionBarSettingsPanel__optionList">
            <DropdownOption
              selected={copyFormat === "svg"}
              disabled={disableCopySvg}
              onClick={() => onCopyFormatChange("svg")}
            >
              SVG
            </DropdownOption>
            <DropdownOption
              selected={copyFormat === "code"}
              onClick={() => onCopyFormatChange("code")}
            >
              React
            </DropdownOption>
          </div>
        </div>
      </div>
    </div>
  )
}
