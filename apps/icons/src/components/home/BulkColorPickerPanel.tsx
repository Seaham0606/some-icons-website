import { ColorField } from 'design-system'

export interface BulkColorPickerPanelProps {
  /** Canonical `#RRGGBB`, or `null` for default (`currentColor`). */
  color: string | null
  onColorChange: (color: string | null) => void
}

/** Preset palette — 6×4 grid, aligned with `.homepage-bulkColorPicker__grid` width in CSS. */
const PRESET_COLORS = [
  '#000000',
  '#FFFFFF',
  '#64748B',
  '#475569',
  '#334155',
  '#0F172A',
  '#DC2626',
  '#EA580C',
  '#CA8A04',
  '#16A34A',
  '#0891B2',
  '#2563EB',
  '#7C3AED',
  '#9333EA',
  '#DB2777',
  '#E11D48',
  '#F97316',
  '#84CC16',
  '#14B8A6',
  '#06B6D4',
  '#8B5CF6',
  '#6366F1',
  '#A855F7',
  '#EC4899',
] as const

function colorsMatch(a: string | null, b: string): boolean {
  if (a == null) return false
  return a.replace(/\s/g, '').toUpperCase() === b.toUpperCase()
}

export function BulkColorPickerPanel({
  color,
  onColorChange,
}: BulkColorPickerPanelProps) {
  return (
    <div className="homepage-bulkColorPicker" role="dialog" aria-label="Icon color">
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
              style={
                selected
                  ? { boxShadow: 'var(--shadow-focus-accent)' }
                  : undefined
              }
            >
              <span
                className="homepage-bulkColorPicker__swatchFill"
                style={{ backgroundColor: hex }}
              />
            </button>
          )
        })}
      </div>
      <ColorField
        className="homepage-bulkColorPicker__colorField"
        showLabel={false}
        label="Hex"
        color={color}
        onColorChange={onColorChange}
        col2Width="size-12"
      />
    </div>
  )
}
