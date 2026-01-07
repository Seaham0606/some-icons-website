import { useExportStore } from '@/stores/exportStore'
import { SIZE_PRESETS } from '@/lib/constants'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { inputBaseStyles } from '@/components/ui/input'

const SIZE_OPTIONS = SIZE_PRESETS.map((size) => ({
  value: size,
  label: String(size),
}))

export function SizeSelector() {
  const size = useExportStore((state) => state.size)
  const setSize = useExportStore((state) => state.setSize)
  const showValidationErrors = useExportStore((state) => state.showValidationErrors)
  const validate = useExportStore((state) => state.validate)
  const [customSize, setCustomSize] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const { sizeValid } = validate()
  const hasError = showValidationErrors && !sizeValid

  const handlePresetClick = (preset: number) => {
    setSize(preset)
    setCustomSize('')
  }

  const handleCustomSizeChange = (value: string) => {
    setCustomSize(value)
    const num = parseInt(value, 10)
    if (!isNaN(num) && num > 0) {
      setSize(num)
    } else if (value === '') {
      setSize(null)
    }
  }

  const hasValue = customSize !== ''
  const isExpanded = isFocused || hasValue

  return (
    <div className="flex gap-2 items-center min-w-0">
      <SegmentedControl
        options={SIZE_OPTIONS}
        value={size}
        onChange={handlePresetClick}
        className="flex-1 min-w-0"
        hasError={hasError}
      />

      <input
        type="number"
        placeholder=""
        value={customSize}
        onChange={(e) => handleCustomSizeChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        min={1}
        className={cn(
          inputBaseStyles,
          'shrink-0 text-center',
          'transition-[width] duration-300',
          isExpanded ? 'w-[64px]' : 'w-[44px]',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          hasError && 'ring-2 ring-[var(--color-warning)]'
        )}
      />
    </div>
  )
}
