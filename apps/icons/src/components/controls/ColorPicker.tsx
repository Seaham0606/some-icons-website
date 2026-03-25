import { Input, nativeInputClassName } from '@/components/ui/input'
import { SomeIcon } from 'design-system'
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
    <div className="ds-colorPickerRow">
      {/* Text input with reset icon inside */}
      <div className="ds-colorPickerInputWrap">
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
          className={cn(!selectedColor && 'ds-input--placeholderEmphasis')}
        />
      </div>

      {/* Color picker box with popover */}
      <div className="ds-colorSwatchHost">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(nativeInputClassName, 'ds-colorSwatchButton')}
          style={{
            backgroundColor: selectedColor ?? 'var(--color-background-input)',
          }}
          aria-label="Open color picker"
        >
          {!selectedColor && (
            <div className="ds-colorPickerSwatchPlaceholder">
              <SomeIcon
                iconName="formatting-eyedropper"
                iconStyle="outline"
                iconSize="sm"
                className="ds-colorPickerSwatchIcon"
              />
            </div>
          )}
        </button>

        {/* Color picker popover */}
        {isOpen && (
          <div
            ref={pickerRef}
            className="ds-colorPickerPopover color-picker-popover"
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
