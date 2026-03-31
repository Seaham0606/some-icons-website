"use client"

import * as React from "react"
import { cn } from "../../utils"

export interface ContextBarProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Number of items in context (e.g. icons selected in the grid). */
  selectedCount: number
}

/**
 * Summarizes multi-select / bulk context (counts, future actions). Base styles only — refine in CSS when ready.
 */
export function ContextBar({
  selectedCount,
  className,
  role = "status",
  "aria-live": ariaLive = "polite",
  "aria-atomic": ariaAtomic = true,
  ...props
}: ContextBarProps) {
  if (selectedCount <= 0) return null

  const label = `${selectedCount} icon${selectedCount === 1 ? "" : "s"} selected`

  return (
    <div
      className={cn("ds-contextBar", className)}
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      {...props}
    >
      {label}
    </div>
  )
}
