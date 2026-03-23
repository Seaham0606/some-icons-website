"use client"

import * as React from "react"
import { cn } from "../../utils"

export type InputGroupColumnWidth = "fit" | "fill"

export interface InputGroupProps {
  className?: string
  leadingSlot?: React.ReactNode
  trailingSlot?: React.ReactNode
  /** `fit` = shrink to content; `fill` = grow in the row flex. @default "fit" */
  leadingWidth?: InputGroupColumnWidth
  /** @default "fit" */
  trailingWidth?: InputGroupColumnWidth
}

export function InputGroup({
  className,
  leadingSlot,
  trailingSlot,
  leadingWidth = "fit",
  trailingWidth = "fit",
}: InputGroupProps) {
  return (
    <div
      className={cn("ds-inputGroup", className)}
      data-component="input-group"
    >
      <div
        className="ds-inputGroup__leading"
        data-part="leading"
        data-width={leadingWidth}
      >
        {leadingSlot}
      </div>
      <div
        className="ds-inputGroup__trailing"
        data-part="trailing"
        data-width={trailingWidth}
      >
        {trailingSlot}
      </div>
    </div>
  )
}
