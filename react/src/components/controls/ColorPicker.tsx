import { Input, inputBaseStyles } from '@/components/ui/input'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { useColorStore } from '@/stores/colorStore'
import { isValidHexColor, normalizeHexColor } from '@/lib/svg-utils'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { HexColorPicker } from 'react-colorful'

export function ColorPicker() {
  const selectedColor = useColorStore((state) => state.selectedColor)
  const setColor = useColorStore((state) => state.setColor)
  const reset = useColorStore((state) => state.reset)
  const [inputValue, setInputValue] = useState(selectedColor ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Sync inputValue with selectedColor from store
  useEffect(() => {
    setInputValue(selectedColor ?? '')
  }, [selectedColor])

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        pickerRef.current &&
        buttonRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

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

      {/* Color picker box with popover */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            inputBaseStyles,
            'w-[44px] shrink-0 cursor-pointer p-0 overflow-hidden',
            'flex items-center justify-center',
            'hover:border-[var(--color-input-stroke-hover)]'
          )}
          style={{
            backgroundColor: selectedColor ?? 'var(--color-input-bg)',
          }}
          aria-label="Open color picker"
        >
          {!selectedColor && (
            <div className="w-5 h-5 text-[var(--item-tertiary)] pointer-events-none">
              <CdnIcon iconId="formatting-eyedropper" className="h-5 w-5" />
            </div>
          )}
        </button>

        {/* Color picker popover */}
        {isOpen && (
          <div
            ref={pickerRef}
            className="absolute top-full right-0 mt-2 z-50 p-4 rounded-[10px] bg-[var(--color-input-bg)] border border-[var(--color-input-stroke)] shadow-lg color-picker-popover"
            onClick={(e) => e.stopPropagation()}
          >
            <HexColorPicker
              color={selectedColor ?? '#000000'}
              onChange={handleColorPickerChange}
              className="custom-color-picker"
            />
          </div>
        )}
      </div>
    </div>
  )
}
