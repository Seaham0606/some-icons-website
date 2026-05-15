"use client"

import * as React from "react"
import { cn } from "../../utils"

export interface InfoPanelProps {
  className?: string
  /** Controls whether the panel is visible (slides in from the right). */
  open?: boolean
  /**
   * Optional top stripe (compose with `.ds-siteHeader__*` top-row classes for parity with SiteHeader).
   * Rendered inside the rail above `children`.
   */
  header?: React.ReactNode
  /** Content rendered inside the panel's content slot. */
  children?: React.ReactNode
  /** Accessible label for the panel region. */
  "aria-label"?: string
}

export function InfoPanel({
  className,
  open = false,
  header,
  children,
  "aria-label": ariaLabel,
}: InfoPanelProps) {
  return (
    <aside
      className={cn("ds-infoPanel", className)}
      data-slot="infoPanel"
      data-open={open ? "true" : "false"}
      aria-hidden={!open}
      aria-label={ariaLabel}
    >
      <div className="ds-infoPanel__rail" data-slot="rail">
        {header != null ? (
          <div className="ds-infoPanel__header" data-slot="infoPanel-header">
            {header}
          </div>
        ) : null}
        <div className="ds-infoPanel__contentSlot" data-slot="contentSlot">
          {children}
        </div>
      </div>
    </aside>
  )
}
