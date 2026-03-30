"use client"

/**
 * ColorSwatch — Figma ColorSwatch (792:18269): 40×40 frame, 8px inset, 4px-radius swatch + strong border.
 * Fill is the chosen color; when `color` is omitted / null / empty, the fill falls back to `var(--color-black)` (default / `currentColor` metaphor in ColorField).
 */

import * as React from "react"
import { cn } from "../../utils"

export interface ColorSwatchProps {
  className?: string
  /** Solid fill (`#rrggbb`, etc.). `null` / omit / empty → palette black (see `.ds-colorSwatch__fill`). */
  color?: string | null
}

export function ColorSwatch({ className, color }: ColorSwatchProps) {
  const fill = color != null && color !== "" ? color : undefined

  return (
    <div
      className={cn("ds-colorSwatch", className)}
      data-component="color-swatch"
      aria-hidden
    >
      <div
        className="ds-colorSwatch__fill"
        style={
          fill != null
            ? ({ ["--ds-colorSwatch-fill" as string]: fill } as React.CSSProperties)
            : undefined
        }
      />
    </div>
  )
}
