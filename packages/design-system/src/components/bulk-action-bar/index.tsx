"use client"

import * as React from "react"
import { cn } from "../../utils"

export interface BulkActionBarProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  /** Number of items in context (e.g. icons selected in the grid). */
  selectedCount: number
  /**
   * When true, the bar stays visible even if `selectedCount` is 0 (bulk session still open).
   */
  sessionActive?: boolean
  /** Optional control(s) to the right of the count label (e.g. select-all). */
  summaryTrailingSlot?: React.ReactNode
  /** Primary actions (e.g. export button). */
  children: React.ReactNode
}

function selectionSummaryLabel(selectedCount: number): string {
  if (selectedCount <= 0) return "No icons selected"
  if (selectedCount === 1) return "1 icon selected"
  return `${selectedCount} icons selected`
}

/**
 * Floating bulk-selection summary with an actions slot.
 * Shown when there is a selection or `sessionActive` keeps the session open after clearing the selection.
 */
export function BulkActionBar({
  selectedCount,
  sessionActive = false,
  summaryTrailingSlot,
  children,
  className,
  role = "region",
  "aria-label": ariaLabel = "Bulk actions",
  ...props
}: BulkActionBarProps) {
  if (selectedCount <= 0 && !sessionActive) return null

  const summary = selectionSummaryLabel(selectedCount)

  return (
    <div
      className={cn("ds-bulkActionBar", className)}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="ds-bulkActionBar__textWrapper">
        <p
          className="ds-bulkActionBar__summary"
          role="status"
          aria-live="polite"
          aria-atomic
        >
          {summary}
        </p>
        {summaryTrailingSlot != null ? (
          <div className="ds-bulkActionBar__summaryTrailing">{summaryTrailingSlot}</div>
        ) : null}
      </div>
      <div className="ds-segmentedControl__dividerWrap" aria-hidden>
        <div className="ds-segmentedControl__divider" />
      </div>
      <div className="ds-bulkActionBar__actions">{children}</div>
    </div>
  )
}
