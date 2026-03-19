"use client"

import * as React from "react"
import type { SomeIconsIconStyle } from "../../constants/some-icons-cdn"
import { someIconsIconUrl } from "../../constants/some-icons-cdn"
import { cn } from "../../utils"

export interface InputSectionProps {
  className?: string
  label?: React.ReactNode
  /**
   * Some Icons CDN icon id for the lead graphic (e.g. `interface-cursor`).
   * Builds `icon-assets/{style}/{category}/{id}.svg` on the CDN.
   * Ignored when `leadSlot` is set.
   */
  leadCdnIcon?: string
  /**
   * CDN asset variant for `leadCdnIcon`. Default `filled`.
   * Ignored when `leadSlot` is set.
   */
  leadIconStyle?: SomeIconsIconStyle
  /** When set, replaces the default CDN lead icon entirely. */
  leadSlot?: React.ReactNode
  contentSlot?: React.ReactNode
  showLabel?: boolean
}

function CdnLeadSlot({
  iconId,
  style,
}: {
  iconId: string
  style: SomeIconsIconStyle
}) {
  const url = someIconsIconUrl(iconId, style)
  return (
    <div className="ds-inputSection__leadSlot" aria-hidden="true">
      <img src={url} alt="" className="ds-inputSection__leadIcon" />
    </div>
  )
}

function DefaultContentSlotPlaceholder() {
  return <div className="ds-inputSection__contentPlaceholder" aria-hidden="true" />
}

export function InputSection({
  className,
  label = "sidebarCard",
  leadCdnIcon = "interface-cursor",
  leadIconStyle = "filled",
  leadSlot,
  contentSlot,
  showLabel = true,
}: InputSectionProps) {
  const resolvedIconId = leadCdnIcon.trim() || "interface-cursor"

  return (
    <section className={cn("ds-inputSection", className)} data-slot="inputSection">
      {showLabel ? (
        <div className="ds-inputSection__labelRow" data-slot="label">
          {leadSlot ?? (
            <CdnLeadSlot iconId={resolvedIconId} style={leadIconStyle} />
          )}
          <div className="ds-inputSection__labelText">{label}</div>
        </div>
      ) : null}

      <div className="ds-inputSection__contentSlot" data-slot="contentSlot">
        {contentSlot ?? <DefaultContentSlotPlaceholder />}
      </div>
    </section>
  )
}

