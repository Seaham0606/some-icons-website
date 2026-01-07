import { Input, inputBaseStyles } from '@/components/ui/input'
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
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Default"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          trailingIcons={selectedColor ? [{
            iconId: "arrow-undo-large",
            style: "outline",
            onClick: handleReset
          }] : undefined}
          className={cn(
            !selectedColor && 'text-[var(--foreground-tertiary)] font-semibold leading-normal'
          )}
        />
      </div>

      {/* Color picker box with eyedropper icon overlay */}
      <div
        className={cn(
          inputBaseStyles,
          'relative w-[44px] shrink-0 cursor-pointer p-0 overflow-hidden',
          'flex items-center justify-center'
        )}
        style={{
          backgroundColor: selectedColor ?? 'var(--color-input-bg)',
        }}
      >
        <input
          type="color"
          value={selectedColor ?? '#000000'}
          onChange={(e) => handleColorPickerChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {!selectedColor && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-[var(--item-tertiary)] pointer-events-none">
            <CdnIcon iconId="general-eyedropper" className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  )
}
