"use client"

import * as React from "react"
import { cn } from "../../utils"
import type { ButtonRadius } from "../button"

export interface ButtonGroupProps {
  className?: string
  /**
   * Corner radius for the fused group shell. Inner buttons use `radius="none"` so the wrapper
   * alone controls rounding.
   */
  radius?: ButtonRadius
  /** Passed to the root `role="group"` for accessibility. */
  "aria-label"?: string
  /** Two or more {@link Button} elements (other nodes are passed through unchanged). */
  children: React.ReactNode
}

/**
 * Horizontal group of {@link Button}s with no gap and a single outer radius — borders overlap
 * between segments. Pass consistent `variant`, `size`, and `tint` on each child so the row reads
 * as one control.
 */
export function ButtonGroup({
  className,
  radius = "md",
  "aria-label": ariaLabel,
  children,
}: ButtonGroupProps) {
  return (
    <div
      className={cn("ds-buttonGroup", "ds-buttonGroup--merged", className)}
      data-component="button-group"
      data-radius={radius}
      role="group"
      aria-label={ariaLabel}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(
          child as React.ReactElement<{ radius?: ButtonRadius; className?: string }>,
          {
            radius: "none",
            className: cn(
              "ds-buttonGroup__btn",
              (child.props as { className?: string }).className,
            ),
          },
        )
      })}
    </div>
  )
}
