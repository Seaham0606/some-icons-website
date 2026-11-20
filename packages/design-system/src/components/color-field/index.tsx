"use client"

/**
 * ColorField — two-column row: hex entry (leading ColorSwatch when committed, drafting, or focused) + read-only picker slot (eyedropper).
 * Canonical value: `null` means default / `currentColor`. Live commits use **6-digit** hex only; `#rgb` shorthand applies on **blur**.
 */

import * as React from "react"
import { cn } from "../../utils"
import { InputField } from "../input-field"
import { ColorSwatch } from "../color-swatch"
import { Input } from "../input"
import { SomeIcon } from "../some-icon"

interface NormalizeHexColorInputOptions {
  /**
   * When true (default), `#rgb` expands to `#RRGGBB`. Set false while typing so values like `#CA3`
   * stay partial until the user finishes six digits or blurs.
   */
  allowShorthand?: boolean
}

/** Complete `#rgb` / `#rrggbb` (when allowed) → normalized `#RRGGBB`, or null. */
function normalizeHexColorInput(
  value: string,
  options?: NormalizeHexColorInputOptions
): string | null {
  const allowShorthand = options?.allowShorthand !== false
  const t = value.trim()
  if (t === "" || t === "#") return null
  const pattern = allowShorthand
    ? /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
    : /^#([0-9a-f]{6})$/i
  const m = t.match(pattern)
  if (!m) return null
  let h = m[1]
  if (allowShorthand && h.length === 3) {
    h = [...h].map((c) => c + c).join("")
  }
  return `#${h.toUpperCase()}`
}

/** Keeps at most six hex digits; optional `#`; strips other characters; **uppercase** output. */
function sanitizePartialHex(raw: string): string {
  const hex = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6).toUpperCase()
  if (hex.length === 0) return raw.includes("#") ? "#" : ""
  return `#${hex}`
}

export interface ColorFieldProps {
  className?: string
  showLabel?: boolean
  label?: React.ReactNode
  /** Canonical `#RRGGBB`, or `null` for default (`currentColor`). */
  color: string | null
  onColorChange: (color: string | null) => void
  col2Width?: "equal" | "size-12"
}

export function ColorField({
  className,
  showLabel = true,
  label = "Color",
  color,
  onColorChange,
  col2Width = "size-12",
}: ColorFieldProps) {
  const [hexText, setHexText] = React.useState(() =>
    color != null
      ? normalizeHexColorInput(color, { allowShorthand: true }) ?? color
      : "",
  )
  const [hexFocused, setHexFocused] = React.useState(false)
  const prevColorRef = React.useRef(color)

  React.useEffect(() => {
    if (color !== prevColorRef.current) {
      prevColorRef.current = color
      if (color != null) {
        setHexText(
          normalizeHexColorInput(color, { allowShorthand: true }) ?? color,
        )
      }
    }
  }, [color])

  const hexTrimmed = hexText.trim()
  const hasUserHexInput =
    hexTrimmed !== "" && hexTrimmed !== "#"
  const canReset = hasUserHexInput || color !== null
  const showLeadingSwatch =
    color !== null || hexFocused || hasUserHexInput

  return (
    <div className={cn("ds-colorField", className)} data-component="color-field">
      <InputField
        showLabel={showLabel}
        label={label}
        showCol2
        col2Width={col2Width}
        contentSlot={
          <Input
            className="ds-colorField__hexInput"
            value={hexText}
            onChange={(e) => {
              const next = sanitizePartialHex(e.target.value)
              setHexText(next)
              const trimmed = next.trim()
              if (trimmed === "" || trimmed === "#") {
                onColorChange(null)
                return
              }
              const strict = normalizeHexColorInput(next, {
                allowShorthand: false,
              })
              if (strict) {
                onColorChange(strict)
              } else {
                onColorChange(null)
              }
            }}
            onFocus={(e) => {
              setHexFocused(true)
              if (e.target.value === "") setHexText("#")
            }}
            onBlur={(e) => {
              setHexFocused(false)
              const v = e.target.value.trim()
              if (v === "" || v === "#") {
                setHexText("")
                onColorChange(null)
                return
              }
              const normalized = normalizeHexColorInput(v, {
                allowShorthand: true,
              })
              if (normalized) {
                setHexText(normalized)
                onColorChange(normalized)
              }
            }}
            placeholder="currentColor"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            leadingSlot={
              showLeadingSwatch ? (
                <div className="ds-colorField__swatchReveal">
                  <ColorSwatch color={color} />
                </div>
              ) : undefined
            }
            trailingSlot={
              <button
                type="button"
                className="ds-colorField__reset"
                aria-label="Reset icon color to default"
                disabled={!canReset}
                onClick={() => {
                  setHexText("")
                  onColorChange(null)
                }}
              >
                <SomeIcon
                  iconName="arrow-undo"
                  iconStyle="outline"
                  iconSize="md"
                  padding="2"
                />
              </button>
            }
          />
        }
        secondarySlot={
          <div
            className="ds-colorField__pickerSlot"
            onMouseDownCapture={(e) => e.preventDefault()}
          >
            <Input
              readOnly
              tabIndex={-1}
              aria-label="Color picker (coming soon)"
              value=""
              placeholder=""
              leadingSlot={
                <SomeIcon
                  iconName="eyedropper"
                  iconStyle="fill"
                  iconSize="md"
                  padding="2"
                />
              }
              showLeading
              showTrailing={false}
            />
          </div>
        }
      />
    </div>
  )
}
