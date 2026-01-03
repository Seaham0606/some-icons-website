import { useExportStore } from '@/stores/exportStore'
import { SIZE_PRESETS } from '@/lib/constants'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const SIZE_OPTIONS = SIZE_PRESETS.map((size) => ({
  value: size,
  label: String(size),
}))

export function SizeSelector() {
  const size = useExportStore((state) => state.size)
  const setSize = useExportStore((state) => state.setSize)
  const [customSize, setCustomSize] = useState('')

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

  return (
    <div className="flex gap-2 items-center">
      <SegmentedControl
        options={SIZE_OPTIONS}
        value={size}
        onChange={handlePresetClick}
        className="flex-1"
      />

      <input
        type="number"
        placeholder=""
        value={customSize}
        onChange={(e) => handleCustomSizeChange(e.target.value)}
        min={1}
        className={cn(
          'w-11 h-11 shrink-0 rounded-[10px] bg-[var(--background-weak)]',
          'text-center text-sm font-semibold',
          'focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]',
          'transition-[width] duration-300 focus:w-20',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
        )}
      />
    </div>
  )
}
