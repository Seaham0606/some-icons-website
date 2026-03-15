import { useFilterStore } from '@/stores/filterStore'
import { SegmentedControl } from '@/components/ui/segmented-control'
import type { IconStyle } from '@/types/icon'

const OPTIONS = [
  { value: 'outline' as const, label: 'Outline' },
  { value: 'filled' as const, label: 'Filled' },
]

export function StyleToggle() {
  const style = useFilterStore((state) => state.style)
  const setStyle = useFilterStore((state) => state.setStyle)

  return (
    <SegmentedControl<IconStyle>
      options={OPTIONS}
      value={style}
      onChange={setStyle}
    />
  )
}
