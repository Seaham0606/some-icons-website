"use client"

/**
 * ColorField — two-column row: hex entry (always-visible leading ColorSwatch) + optional picker slot (eyedropper opens HexColorPicker popover).
 * Canonical value: `null` means default / `currentColor`. Live commits use **6-digit** hex only; `#rgb` shorthand applies on **blur**.
 */

import * as React from "react"
import { HexColorPicker } from "react-colorful"
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
  col2Width?: "equal" | "size-10" | "size-12"
  /** When false, the eyedropper picker column is hidden. @default true */
  showPicker?: boolean
}

export function ColorField({
  className,
  showLabel = true,
  label = "Color",
  color,
  onColorChange,
  col2Width = "size-10",
  showPicker = true,
}: ColorFieldProps) {
  const [hexText, setHexText] = React.useState(() =>
    color != null
      ? normalizeHexColorInput(color, { allowShorthand: true }) ?? color
      : "",
  )
  const prevColorRef = React.useRef(color)
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const pickerAnchorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (color !== prevColorRef.current) {
      prevColorRef.current = color
      if (color != null) {
        setHexText(
          normalizeHexColorInput(color, { allowShorthand: true }) ?? color,
        )
      } else {
        setHexText("")
      }
    }
  }, [color])

  React.useEffect(() => {
    if (!pickerOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickerOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target instanceof Node ? e.target : null
      if (!node) return
      if (pickerAnchorRef.current?.contains(node)) return
      setPickerOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown, true)
    }
  }, [pickerOpen])

  const hexTrimmed = hexText.trim()
  const hasUserHexInput =
    hexTrimmed !== "" && hexTrimmed !== "#"
  const canReset = hasUserHexInput || color !== null

  /** Value fed to HexColorPicker — falls back to black when unset. */
  const pickerValue = color ?? "#000000"

  return (
    <div className={cn("ds-colorField", className)} data-component="color-field">
      <InputField
        showLabel={showLabel}
        label={label}
        showCol2={showPicker}
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
              if (e.target.value === "") setHexText("#")
            }}
            onBlur={(e) => {
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
            placeholder="default"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            showLeading
            leadingSlot={
              <div ref={pickerAnchorRef} className="ds-colorField__swatchWrap">
                {pickerOpen && (
                  <div className="ds-colorField__pickerPop" role="dialog" aria-label="Color picker">
                    <HexColorPicker
                      color={pickerValue}
                      onChange={(hex) => {
                        const normalized = normalizeHexColorInput(hex, { allowShorthand: false })
                        if (normalized) onColorChange(normalized)
                      }}
                    />
                  </div>
                )}
                <button
                  type="button"
                  className="ds-colorField__swatchBtn"
                  aria-label="Open color picker"
                  aria-expanded={pickerOpen}
                  aria-haspopup="dialog"
                  onClick={() => setPickerOpen((o) => !o)}
                >
                  <ColorSwatch color={color} />
                </button>
              </div>
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
          <button
            type="button"
            className="ds-colorField__pickerBtn"
            aria-label="Color picker (coming soon)"
            disabled
          >
            <SomeIcon
              iconName="formatting-eyedropper"
              iconStyle="outline"
              iconSize="md"
              padding="0"
            />
          </button>
        }
      />
    </div>
  )
}
