"use client"

import * as React from "react"
import { cn } from "../../utils"

export type ChipVariant =
  | "neutral"
  | "strong"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "inverse"
  | "transparent"

const chipLabelClassName = {
  default: "label-3xs",
  md: "label-xs",
} as const

export type ChipLabelSize = keyof typeof chipLabelClassName

export interface ChipProps extends React.ComponentPropsWithoutRef<"span"> {
  variant?: ChipVariant
  /**
   * When true, applies `backdrop-filter: blur(4px)` (plus `-webkit-backdrop-filter`).
   */
  backdropBlur?: boolean
  /** One step above the default chip label (`label-3xs`). */
  labelSize?: ChipLabelSize
}

export function Chip({
  variant = "neutral",
  backdropBlur = false,
  labelSize = "default",
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn("ds-chip", chipLabelClassName[labelSize], className)}
      data-variant={variant}
      data-backdrop-blur={backdropBlur ? "true" : undefined}
      {...props}
    >
      <span className="ds-chip__label">{children}</span>
    </span>
  )
}

export interface ChipButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: ChipVariant
  backdropBlur?: boolean
  /** Rendered inside the chip pill after the label (e.g. install info on the React tab). */
  trailingSlot?: React.ReactNode
  /**
   * When true, uses the compound pill shell (label segment + optional trailing) even
   * without `trailingSlot` — keeps tab chips visually consistent when only some have icons.
   */
  compoundShell?: boolean
  /** One step above the default chip label (`label-3xs`). */
  labelSize?: ChipLabelSize
}

export function ChipButton({
  variant = "neutral",
  backdropBlur = false,
  trailingSlot,
  compoundShell = false,
  labelSize = "default",
  className,
  children,
  type = "button",
  disabled,
  ...props
}: ChipButtonProps) {
  const chipClass = cn("ds-chip", chipLabelClassName[labelSize], className)
  const variantProps = {
    "data-variant": variant,
    "data-backdrop-blur": backdropBlur ? ("true" as const) : undefined,
  }

  const useCompoundShell = compoundShell || trailingSlot != null

  if (!useCompoundShell) {
    return (
      <button
        type={type}
        className={chipClass}
        disabled={disabled}
        {...variantProps}
        {...props}
      >
        <span className="ds-chip__label">{children}</span>
      </button>
    )
  }

  return (
    <span
      className={cn(chipClass, "ds-chip--compound")}
      data-has-trailing={trailingSlot != null ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      {...variantProps}
    >
      <button
        type={type}
        className="ds-chip__segment"
        disabled={disabled}
        {...props}
      >
        <span className="ds-chip__label">{children}</span>
      </button>
      {trailingSlot}
    </span>
  )
}
