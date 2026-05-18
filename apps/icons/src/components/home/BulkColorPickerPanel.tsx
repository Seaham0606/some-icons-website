import * as React from 'react'
import { HexColorPicker } from 'react-colorful'
import { Input, ColorSwatch, SomeIcon } from 'design-system'

export interface BulkColorPickerPanelProps {
  /** Canonical `#RRGGBB`, or `null` for default (`currentColor`). */
  color: string | null
  onColorChange: (color: string | null) => void
}

/** Preset palette — 6×2 grid (4 grayscale + 8 colors at 400-level tokens). */
const PRESET_COLORS = [
  // Grayscale row (4 stops: near-black → white)
  '#292929',
  '#707070',
  '#DADADA',
  '#FFFFFF',
  // Color row (400-level tokens)
  '#FF7575',
  '#FF8F66',
  '#FFC94D',
  '#9EE55C',
  '#67EAF5',
  '#66B6FF',
  '#B785FB',
  '#FF8FEC',
] as const

interface NormalizeOptions {
  allowShorthand?: boolean
}

function normalizeHexColorInput(value: string, options?: NormalizeOptions): string | null {
  const allowShorthand = options?.allowShorthand !== false
  const t = value.trim()
  if (t === '' || t === '#') return null
  const pattern = allowShorthand
    ? /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
    : /^#([0-9a-f]{6})$/i
  const m = t.match(pattern)
  if (!m) return null
  let h = m[1]
  if (allowShorthand && h.length === 3) {
    h = [...h].map((c) => c + c).join('')
  }
  return `#${h.toUpperCase()}`
}

function sanitizePartialHex(raw: string): string {
  const hex = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6).toUpperCase()
  if (hex.length === 0) return raw.includes('#') ? '#' : ''
  return `#${hex}`
}

function colorsMatch(a: string | null, b: string): boolean {
  if (a == null) return false
  return a.replace(/\s/g, '').toUpperCase() === b.toUpperCase()
}

/** Hex field + Hue wheel popover (opened from leading swatch). */
export function ColorHexField({
  color,
  onColorChange,
}: BulkColorPickerPanelProps) {
  const [hexText, setHexText] = React.useState(() =>
    color != null ? (normalizeHexColorInput(color, { allowShorthand: true }) ?? color) : '',
  )
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const prevColorRef = React.useRef(color)
  const hexRowRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (color === prevColorRef.current) return
    prevColorRef.current = color
    if (color != null) {
      setHexText(normalizeHexColorInput(color, { allowShorthand: true }) ?? color)
    } else {
      setHexText('')
    }
  }, [color])

  React.useEffect(() => {
    if (!pickerOpen) return
    const handler = (e: PointerEvent) => {
      if (hexRowRef.current && !hexRowRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [pickerOpen])

  const hexTrimmed = hexText.trim()
  const hasUserHexInput = hexTrimmed !== '' && hexTrimmed !== '#'
  const canReset = hasUserHexInput || color !== null
  const pickerValue = color ?? '#000000'

  return (
    <div ref={hexRowRef} className="homepage-bulkColorPicker__hexRow">
      <Input
        value={hexText}
        onChange={(e) => {
          const next = sanitizePartialHex(e.target.value)
          setHexText(next)
          const trimmed = next.trim()
          if (trimmed === '' || trimmed === '#') {
            onColorChange(null)
            return
          }
          const strict = normalizeHexColorInput(next, { allowShorthand: false })
          if (strict) onColorChange(strict)
          else onColorChange(null)
        }}
        onFocus={(e) => {
          if (e.target.value === '') setHexText('#')
        }}
        onBlur={(e) => {
          const v = e.target.value.trim()
          if (v === '' || v === '#') {
            setHexText('')
            onColorChange(null)
            return
          }
          const normalized = normalizeHexColorInput(v, { allowShorthand: true })
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
          <button
            type="button"
            className="ds-colorField__swatchBtn"
            aria-label="Open color picker"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((p) => !p)}
          >
            <ColorSwatch color={color} />
          </button>
        }
        trailingSlot={
          <button
            type="button"
            className="ds-colorField__reset"
            aria-label="Reset icon color to default"
            disabled={!canReset}
            onClick={() => {
              setHexText('')
              onColorChange(null)
            }}
          >
            <SomeIcon iconName="arrow-undo" iconStyle="outline" iconSize="md" padding="2" />
          </button>
        }
      />
      {pickerOpen && (
        <div className="ds-colorField__pickerPop">
          <HexColorPicker
            color={pickerValue}
            onChange={(hex) => {
              const upper = hex.toUpperCase()
              setHexText(upper)
              onColorChange(upper)
            }}
          />
        </div>
      )}
    </div>
  )
}

function BulkColorPresetGrid({ color, onColorChange }: BulkColorPickerPanelProps) {
  return (
    <div className="homepage-bulkColorPicker__grid">
      {PRESET_COLORS.map((hex) => {
        const selected = colorsMatch(color, hex)
        return (
          <button
            key={hex}
            type="button"
            className="homepage-bulkColorPicker__swatch"
            aria-label={`Set icon color to ${hex}`}
            aria-pressed={selected}
            onClick={() => onColorChange(hex)}
            style={selected ? { boxShadow: 'var(--shadow-focus-accent)' } : undefined}
          >
            <span
              className="homepage-bulkColorPicker__swatchFill"
              style={{ backgroundColor: hex }}
            />
          </button>
        )
      })}
    </div>
  )
}

/** Floating panel: presets only (e.g. icon info rail palette popover). */
export function BulkColorPresetPanel(props: BulkColorPickerPanelProps) {
  return (
    <div
      className="homepage-bulkColorPicker homepage-bulkColorPicker--presetsOnly"
      role="dialog"
      aria-label="Color presets"
    >
      <BulkColorPresetGrid {...props} />
    </div>
  )
}

/** Full bulk bar popup: hex + presets. */
export function BulkColorPickerPanel(props: BulkColorPickerPanelProps) {
  return (
    <div className="homepage-bulkColorPicker" role="dialog" aria-label="Icon color">
      <ColorHexField {...props} />
      <BulkColorPresetGrid {...props} />
    </div>
  )
}
