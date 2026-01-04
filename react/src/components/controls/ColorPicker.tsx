import { Input } from '@/components/ui/input'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { useColorStore } from '@/stores/colorStore'
import { isValidHexColor, normalizeHexColor } from '@/lib/svg-utils'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function ColorPicker() {
  const selectedColor = useColorStore((state) => state.selectedColor)
  const setColor = useColorStore((state) => state.setColor)
  const reset = useColorStore((state) => state.reset)
  const [inputValue, setInputValue] = useState(selectedColor ?? '')

  // Sync inputValue with selectedColor from store
  useEffect(() => {
    setInputValue(selectedColor ?? '')
  }, [selectedColor])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    const normalized = normalizeHexColor(value)
    if (isValidHexColor(normalized)) {
      setColor(normalized)
    }
  }

  const handleColorPickerChange = (value: string) => {
    const normalized = value.toUpperCase()
    setInputValue(normalized)
    setColor(normalized)
  }

  const handleReset = () => {
    reset()
    setInputValue('')
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Text input with reset icon inside */}
      <div className="relative flex-1 h-12">
        <Input
          type="text"
          placeholder="Default"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className={cn(
            'pr-10',
            !selectedColor && 'text-[var(--foreground-tertiary)] font-semibold leading-normal'
          )}
        />
        <button
          onClick={handleReset}
          disabled={!selectedColor}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center',
            'text-[var(--item-tertiary)] transition-all duration-200',
            selectedColor && 'cursor-pointer hover:text-[var(--warning)] hover:-rotate-180'
          )}
          aria-label="Reset color"
        >
          <CdnIcon iconId="arrow-undo-large" className="h-6 w-6" />
        </button>
      </div>

      {/* Color picker box with eyedropper icon overlay */}
      <div
        className="relative w-12 h-12 shrink-0 rounded-[10px] cursor-pointer"
        style={{
          backgroundColor: selectedColor ?? 'var(--background-weak)',
        }}
      >
        <input
          type="color"
          value={selectedColor ?? '#000000'}
          onChange={(e) => handleColorPickerChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {!selectedColor && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[var(--item-tertiary)] pointer-events-none">
            <CdnIcon iconId="general-eyedropper" className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}
