import * as React from 'react'
import { Button, Input, ColorSwatch, SomeIcon } from 'design-system'
import { SHOW_COLOR_PRESET_SWATCHES } from '@/lib/constants'

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

interface Hsva {
  h: number
  s: number
  v: number
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/** Matches `var(--size-3)` on `.ds-colorField__pickerPointer--slider`. */
const BRIGHTNESS_SLIDER_POINTER_SIZE = 12
/** Matches `var(--spacing-padding-1)` inset at each end of the track. */
const BRIGHTNESS_SLIDER_TRACK_INSET = 4

function brightnessPointerTop(v: number): string {
  const frac = 1 - v
  return `calc(var(--spacing-padding-1) + ${frac} * (100% - 2 * var(--spacing-padding-1) - var(--size-3)) + var(--size-3) / 2)`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHexColorInput(hex, { allowShorthand: true }) ?? '#000000'
  const n = Number.parseInt(normalized.slice(1), 16)
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toByte = (channel: number) =>
    Math.min(255, Math.max(0, Math.round(channel)))
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  return `#${toByte(r)}${toByte(g)}${toByte(b)}`
}

function rgbToHsva(r: number, g: number, b: number): Hsva {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : delta / max
  return { h, s, v: max }
}

function hsvaToRgb({ h, s, v }: Hsva): { r: number; g: number; b: number } {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let rp = 0
  let gp = 0
  let bp = 0

  if (h < 60) {
    rp = c
    gp = x
  } else if (h < 120) {
    rp = x
    gp = c
  } else if (h < 180) {
    gp = c
    bp = x
  } else if (h < 240) {
    gp = x
    bp = c
  } else if (h < 300) {
    rp = x
    bp = c
  } else {
    rp = c
    bp = x
  }

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  }
}

function hexToHsva(hex: string): Hsva {
  const { r, g, b } = hexToRgb(hex)
  return rgbToHsva(r, g, b)
}

function hsvaToHex(hsva: Hsva): string {
  const { r, g, b } = hsvaToRgb(hsva)
  return rgbToHex(r, g, b)
}

const HUE_CANVAS_MIN_SIZE = 1

function polarHueFromPoint(
  x: number,
  y: number,
  center: number,
  maxRadius: number,
): { h: number; s: number } {
  const dx = x - center + 0.5
  const dy = y - center + 0.5
  const dist = Math.min(1, Math.hypot(dx, dy) / maxRadius)
  let h = (Math.atan2(dy, dx) * 180) / Math.PI
  if (h < 0) h += 360
  return { h, s: dist }
}

function drawHueCanvas(canvas: HTMLCanvasElement, size: number) {
  const ctx = canvas.getContext('2d')
  if (!ctx || size < HUE_CANVAS_MIN_SIZE) return

  const pixelSize = Math.max(HUE_CANVAS_MIN_SIZE, Math.round(size))
  canvas.width = pixelSize
  canvas.height = pixelSize

  const center = pixelSize / 2
  const maxRadius = center

  for (let y = 0; y < pixelSize; y += 1) {
    for (let x = 0; x < pixelSize; x += 1) {
      const { h, s } = polarHueFromPoint(x, y, center, maxRadius)
      const { r, g, b } = hsvaToRgb({ h, s, v: 1 })
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

function huePointerPosition(hsva: Hsva): { left: string; top: string } {
  const rad = (hsva.h * Math.PI) / 180
  const radiusFrac = hsva.s * 50
  return {
    left: `${50 + radiusFrac * Math.cos(rad)}%`,
    top: `${50 + radiusFrac * Math.sin(rad)}%`,
  }
}

function usePointerDrag(
  onPointer: (clientX: number, clientY: number) => void,
) {
  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    onPointer(event.clientX, event.clientY)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    onPointer(event.clientX, event.clientY)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp }
}

function HueSquare({
  hsva,
  onChange,
}: {
  hsva: Hsva
  onChange: (next: Hsva) => void
}) {
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const hsvaRef = React.useRef(hsva)
  hsvaRef.current = hsva

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const surface = surfaceRef.current
    const canvas = canvasRef.current
    if (!surface || !canvas) return

    const redraw = () => {
      const size = surface.clientWidth
      if (size <= 0) return
      drawHueCanvas(canvas, size)
    }

    redraw()
    const observer = new ResizeObserver(redraw)
    observer.observe(surface)
    return () => observer.disconnect()
  }, [])

  const pickFromPointer = React.useCallback(
    (clientX: number, clientY: number) => {
      const surface = surfaceRef.current
      if (!surface) return
      const rect = surface.getBoundingClientRect()
      const size = rect.width
      if (size <= 0) return
      const x = ((clientX - rect.left) / rect.width) * size
      const y = ((clientY - rect.top) / rect.height) * size
      const center = size / 2
      const { h, s } = polarHueFromPoint(x, y, center, center)
      const current = hsvaRef.current
      onChange({
        h,
        s,
        v: current.v,
      })
    },
    [onChange],
  )

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    usePointerDrag(pickFromPointer)

  const pointerPosition = huePointerPosition(hsva)

  return (
    <div
      ref={surfaceRef}
      className="ds-colorField__hueSquare"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        className="ds-colorField__hueSquareCanvas"
        aria-hidden
      />
      <span
        className="ds-colorField__pickerPointer ds-colorField__pickerPointer--square"
        style={pointerPosition}
        aria-hidden
      />
    </div>
  )
}

function BrightnessSlider({
  hsva,
  onChange,
}: {
  hsva: Hsva
  onChange: (next: Hsva) => void
}) {
  const sliderRef = React.useRef<HTMLDivElement>(null)
  const hsvaRef = React.useRef(hsva)
  hsvaRef.current = hsva

  const lowColor = hsvaToHex({ h: hsva.h, s: hsva.s, v: 0 })
  const highColor = hsvaToHex({ h: hsva.h, s: hsva.s, v: 1 })

  const pickFromPointer = React.useCallback(
    (_clientX: number, clientY: number) => {
      const slider = sliderRef.current
      if (!slider) return
      const rect = slider.getBoundingClientRect()
      const half = BRIGHTNESS_SLIDER_POINTER_SIZE / 2
      const usableHeight =
        rect.height - 2 * BRIGHTNESS_SLIDER_TRACK_INSET - BRIGHTNESS_SLIDER_POINTER_SIZE
      const y =
        usableHeight <= 0
          ? 0
          : clamp01(
              (clientY - rect.top - BRIGHTNESS_SLIDER_TRACK_INSET - half) /
                usableHeight,
            )
      onChange({
        ...hsvaRef.current,
        v: 1 - y,
      })
    },
    [onChange],
  )

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    usePointerDrag(pickFromPointer)

  return (
    <div
      ref={sliderRef}
      className="ds-colorField__brightnessSlider"
      role="slider"
      aria-label="Brightness"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(hsva.v * 100)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="ds-colorField__brightnessSliderFill"
        style={{
          background: `linear-gradient(to top, ${lowColor}, ${highColor})`,
        }}
        aria-hidden
      />
      <span
        className="ds-colorField__pickerPointer ds-colorField__pickerPointer--slider"
        style={{ top: brightnessPointerTop(hsva.v) }}
        aria-hidden
      />
    </div>
  )
}

function InlineHsvColorPicker({
  color,
  onChange,
}: {
  color: string
  onChange: (hex: string) => void
}) {
  const [hsva, setHsva] = React.useState(() => hexToHsva(color))
  const hsvaRef = React.useRef(hsva)
  hsvaRef.current = hsva
  const prevColorRef = React.useRef(color)

  React.useEffect(() => {
    if (color === prevColorRef.current) return
    prevColorRef.current = color

    const emitted = hsvaToHex(hsvaRef.current)
    const external = normalizeHexColorInput(color, { allowShorthand: true })
    const internal = normalizeHexColorInput(emitted, { allowShorthand: true })
    if (external != null && internal != null && external === internal) return

    setHsva(hexToHsva(color))
  }, [color])

  const handleChange = (next: Hsva) => {
    setHsva(next)
    onChange(hsvaToHex(next))
  }

  return (
    <div className="ds-colorField__pickerColumns">
      <HueSquare hsva={hsva} onChange={handleChange} />
      <BrightnessSlider hsva={hsva} onChange={handleChange} />
    </div>
  )
}

/** Hex field + inline colour picker (toggle from trailing eyedropper button). */
export function ColorHexField({
  color,
  onColorChange,
}: BulkColorPickerPanelProps) {
  const [hexText, setHexText] = React.useState(() =>
    color != null ? (normalizeHexColorInput(color, { allowShorthand: true }) ?? color) : '',
  )
  const [pickerOpen, setPickerOpen] = React.useState(false)
  const prevColorRef = React.useRef(color)

  React.useEffect(() => {
    if (color === prevColorRef.current) return
    prevColorRef.current = color
    if (color != null) {
      setHexText(normalizeHexColorInput(color, { allowShorthand: true }) ?? color)
    } else {
      setHexText('')
    }
  }, [color])

  const pickerValue = color ?? '#FF0000'

  return (
    <div className="homepage-bulkColorPicker__hexRow">
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
          <div className="ds-colorField__swatchReveal" aria-hidden>
            <ColorSwatch color={color} />
          </div>
        }
        trailingSlot={
          <button
            type="button"
            className={`ds-colorField__pickerTrigger${pickerOpen ? ' ds-colorField__pickerTrigger--active' : ''}`}
            aria-label={pickerOpen ? 'Close color picker' : 'Open color picker'}
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((p) => !p)}
          >
            <SomeIcon
              iconName="eyedropper"
              iconStyle="fill"
              iconSize="md"
              padding="2"
            />
          </button>
        }
      />
      {pickerOpen ? (
        <div className="ds-colorField__pickerInline">
          <InlineHsvColorPicker
            color={pickerValue}
            onChange={(hex) => {
              const upper = hex.toUpperCase()
              setHexText(upper)
              onColorChange(upper)
            }}
          />
        </div>
      ) : null}
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

/** Info panel col-2: opens preset swatch grid (same width as size custom input). */
export function ColorPresetTrigger({ color, onColorChange }: BulkColorPickerPanelProps) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: PointerEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  return (
    <div
      ref={anchorRef}
      className="homepage-infoPanel-colorAnchor"
    >
      <Button
        type="button"
        variant="transparent"
        size="md"
        radius="lg"
        className="homepage-infoPanelContent__colorSwatchesBtn"
        aria-label="Color presets"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        leadingSlot={
          color != null ? (
            <span
              className="homepage-bulkAction-colorDot"
              style={{ backgroundColor: color }}
            />
          ) : (
            <span className="homepage-infoPanelContent__colorSwatchMini" aria-hidden>
              {PRESET_COLORS.slice(0, 4).map((hex) => (
                <span
                  key={hex}
                  className="homepage-infoPanelContent__colorSwatchMiniCell"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </span>
          )
        }
      />
      {open ? (
        <div className="homepage-infoPanel-colorPop">
          <BulkColorPresetPanel
            color={color}
            onColorChange={(next) => {
              onColorChange(next)
              setOpen(false)
            }}
          />
        </div>
      ) : null}
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
      {SHOW_COLOR_PRESET_SWATCHES ? <BulkColorPresetGrid {...props} /> : null}
    </div>
  )
}
