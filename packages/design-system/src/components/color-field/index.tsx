"use client"

/**
 * ColorField — two-column row: hex entry (leading placeholder for future swatch) + read-only picker slot (eyedropper).
 * Canonical value: `null` means default / `currentColor`.
 */

import * as React from "react"
import { cn } from "../../utils"
import { InputField } from "../input-field"
import { ColorSwatch } from "../color-swatch"
import { Input } from "../input"
import { SomeIcon } from "../some-icon"

/** Complete `#rgb` / `#rrggbb` only; returns normalized `#rrggbb` or null for empty / invalid. */
export function normalizeHexColorInput(value: string): string | null {
  const t = value.trim()
  if (t === "" || t === "#") return null
  const m = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  let h = m[1]
  if (h.length === 3) {
    h = [...h].map((c) => c + c).join("")
  }
  return `#${h.toLowerCase()}`
}

/** Keeps at most six hex digits; optional `#`; strips other characters. */
function sanitizePartialHex(raw: string): string {
  const hex = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6)
  if (hex.length === 0) return raw.includes("#") ? "#" : ""
  return `#${hex}`
}

export interface ColorFieldProps {
  className?: string
  showLabel?: boolean
  label?: React.ReactNode
  /** Canonical `#rrggbb`, or `null` for default (`currentColor`). */
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
  const [hexText, setHexText] = React.useState(() => color ?? "")
  const prevColorRef = React.useRef(color)

  React.useEffect(() => {
    if (color !== prevColorRef.current) {
      prevColorRef.current = color
      setHexText(color ?? "")
    }
  }, [color])

  const hexTrimmed = hexText.trim()
  const hasUserHexInput =
    hexTrimmed !== "" && hexTrimmed !== "#"
  const canReset = hasUserHexInput || color !== null

  return (
    <div className={cn("ds-colorField", className)} data-component="color-field">
      <InputField
        showLabel={showLabel}
        label={label}
        showCol2
        col2Width={col2Width}
        contentSlot={
          <Input
            value={hexText}
            onChange={(e) => {
              const next = sanitizePartialHex(e.target.value)
              setHexText(next)
              const trimmed = next.trim()
              if (trimmed === "" || trimmed === "#") {
                onColorChange(null)
                return
              }
              const normalized = normalizeHexColorInput(next)
              if (normalized) onColorChange(normalized)
            }}
            onFocus={(e) => {
              if (e.target.value === "") setHexText("#")
            }}
            onBlur={(e) => {
              const v = e.target.value.trim()
              if (v === "" || v === "#") {
                setHexText("")
                onColorChange(null)
                return
              }
              const normalized = normalizeHexColorInput(v)
              if (normalized) {
                setHexText(normalized)
                onColorChange(normalized)
              }
            }}
            placeholder="default"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            leadingSlot={<ColorSwatch color={color} />}
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
                  iconName="formatting-eyedropper"
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
