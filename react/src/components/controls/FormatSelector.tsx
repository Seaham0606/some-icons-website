import { useExportStore } from '@/stores/exportStore'
import { SegmentedControl } from '@/components/ui/segmented-control'
import type { ExportFormat } from '@/lib/constants'

const OPTIONS = [
  { value: 'svg' as const, label: 'SVG' },
  { value: 'png' as const, label: 'PNG' },
]

export function FormatSelector() {
  const format = useExportStore((state) => state.format)
  const setFormat = useExportStore((state) => state.setFormat)
  const showValidationErrors = useExportStore((state) => state.showValidationErrors)
  const validate = useExportStore((state) => state.validate)

  const { formatValid } = validate()
  const hasError = showValidationErrors && !formatValid

  return (
    <SegmentedControl<ExportFormat>
      options={OPTIONS}
      value={format}
      onChange={setFormat}
      hasError={hasError}
    />
  )
}
