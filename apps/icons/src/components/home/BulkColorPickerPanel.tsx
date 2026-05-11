import { ColorField, SomeIcon } from 'design-system'

/** Returns true if the hex color is perceptually light (checkmark should be dark). */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b > 0.7
}

export const BULK_COLOR_PRESETS = [
  // Grayscale row (4 stops: near-black → white)
  { label: 'Near black', value: '#292929' },
  { label: 'Mid gray', value: '#707070' },
  { label: 'Light gray', value: '#DADADA' },
  { label: 'White', value: '#FFFFFF' },
  // Color row (400-level tokens)
  { label: 'Red', value: '#FF7575' },
  { label: 'Orange', value: '#FF8F66' },
  { label: 'Yellow', value: '#FFC94D' },
  { label: 'Green', value: '#9EE55C' },
  { label: 'Teal', value: '#67EAF5' },
  { label: 'Blue', value: '#66B6FF' },
  { label: 'Purple', value: '#B785FB' },
  { label: 'Pink', value: '#FF8FEC' },
] as const

interface BulkColorPickerPanelProps {
  /** Current active color (`#RRGGBB`) or `null` for default. */
  color: string | null
  onColorChange: (color: string | null) => void
}

export function BulkColorPickerPanel({ color, onColorChange }: BulkColorPickerPanelProps) {
  return (
    <div
      className="homepage-bulkColorPicker"
      role="dialog"
      aria-label="Icon color"
      data-component="bulk-color-picker"
    >
      <ColorField
        className="homepage-bulkColorPicker__colorField"
        showLabel={false}
        showPicker={false}
        color={color}
        onColorChange={onColorChange}
      />

      <div
        className="homepage-bulkColorPicker__grid"
        role="radiogroup"
        aria-label="Color presets"
      >
        {BULK_COLOR_PRESETS.map((preset) => {
          const isSelected = color === preset.value
          const checkColor = isLightColor(preset.value) ? 'var(--color-black)' : 'var(--color-white)'
          return (
            <button
              key={preset.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={preset.label}
              className="homepage-bulkColorPicker__swatch"
              onClick={() => onColorChange(isSelected ? null : preset.value)}
            >
              <span
                className="homepage-bulkColorPicker__swatchFill"
                style={{ backgroundColor: preset.value }}
                aria-hidden
              >
                {isSelected && (
                  <SomeIcon
                    iconName="symbol-check-mark"
                    iconStyle="outline"
                    iconSize="sm"
                    padding="0"
                    color={checkColor}
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
