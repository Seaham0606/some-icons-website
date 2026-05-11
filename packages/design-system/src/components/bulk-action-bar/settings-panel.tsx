"use client"

/**
 * Bulk action bar export settings — Figma InputSection variant (node 1199:8185):
 * grouped “Copy as” / “Download as” rows built from {@link DropdownOption} + shell tokens.
 *
 * Copy target (SVG vs React) and download asset type (SVG vs PNG) are independent.
 */

import * as React from "react"
import { cn } from "../../utils"
import { DropdownOption } from "../dropdown/dropdown-option"
import { SomeIcon } from "../some-icon"

export type BulkActionBarCopyFormat = "svg" | "code"

export type BulkActionBarDownloadFormat = "svg" | "png"

export interface BulkActionBarSettingsPanelProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  copyFormat: BulkActionBarCopyFormat
  downloadFormat: BulkActionBarDownloadFormat
  onCopyFormatChange: (format: BulkActionBarCopyFormat) => void
  onDownloadFormatChange: (format: BulkActionBarDownloadFormat) => void
  /**
   * Disables “Copy as SVG” (e.g. multi-select: only React copy is available in product rules).
   */
  disableCopySvg?: boolean
}

export function BulkActionBarSettingsPanel({
  copyFormat,
  downloadFormat,
  onCopyFormatChange,
  onDownloadFormatChange,
  disableCopySvg = false,
  className,
  role = "region",
  "aria-label": ariaLabel = "Bulk export format",
  ...props
}: BulkActionBarSettingsPanelProps) {
  const icon = (name: string) => (
    <SomeIcon
      iconName={name}
      iconStyle="outline"
      iconSize="md"
      padding="050"
    />
  )

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

        <div className="ds-bulkActionBarSettingsPanel__divider" aria-hidden />

        <div
          className="ds-bulkActionBarSettingsPanel__section"
          role="group"
          aria-label="Download as"
        >
          <div className="ds-bulkActionBarSettingsPanel__sectionLabel">Download as:</div>
          <div className="ds-bulkActionBarSettingsPanel__optionList">
            <DropdownOption
              selected={downloadFormat === "svg"}
              onClick={() => onDownloadFormatChange("svg")}
            >
              SVG
            </DropdownOption>
            <DropdownOption
              selected={downloadFormat === "png"}
              onClick={() => onDownloadFormatChange("png")}
            >
              PNG
            </DropdownOption>
          </div>
        </div>
      </div>
    </div>
  )
}
