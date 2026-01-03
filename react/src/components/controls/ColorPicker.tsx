import { Input } from '@/components/ui/input'
import { useColorStore } from '@/stores/colorStore'
import { isValidHexColor, normalizeHexColor } from '@/lib/svg-utils'
import { RotateCcw, Pencil } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ColorPicker() {
  const selectedColor = useColorStore((state) => state.selectedColor)
  const setColor = useColorStore((state) => state.setColor)
  const reset = useColorStore((state) => state.reset)
  const [inputValue, setInputValue] = useState(selectedColor ?? '')

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
      <div className="relative flex-1 h-11">
        <Input
          type="text"
          placeholder="Default"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className={cn(
            'h-11 bg-[var(--background-weak)] border-0 pr-10 font-mono',
            !selectedColor && 'text-[var(--foreground-disabled)]'
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
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Color picker box with pencil icon overlay */}
      <div
        className="relative w-11 h-11 shrink-0 rounded-[10px] cursor-pointer"
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
        <Pencil
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-[var(--item-tertiary)] pointer-events-none"
        />
      </div>
    </div>
  )
}
