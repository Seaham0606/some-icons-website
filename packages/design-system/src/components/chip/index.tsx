"use client"

import * as React from "react"
import { cn } from "../../utils"

export type ChipVariant = "neutral" | "accent" | "success" | "warning" | "error" | "inverse"

export interface ChipProps extends React.ComponentPropsWithoutRef<"span"> {
  variant?: ChipVariant
  /**
   * When true, applies `backdrop-filter: blur(4px)` (plus `-webkit-backdrop-filter`).
   */
  backdropBlur?: boolean
}

export function Chip({
  variant = "neutral",
  backdropBlur = false,
  className,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn("ds-chip label-3xs", className)}
      data-variant={variant}
      data-backdrop-blur={backdropBlur ? "true" : undefined}
      {...props}
    />
  )
}

