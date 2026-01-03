import { useSelectionStore } from '@/stores/selectionStore'
import { useExportStore } from '@/stores/exportStore'
import { useColorStore } from '@/stores/colorStore'
import { useFilterStore } from '@/stores/filterStore'
import { useIcons } from '@/hooks/useIcons'
import { exportToZip, downloadBlob } from '@/lib/export-utils'
import { fetchSvg } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ExportButton() {
  const { data: icons } = useIcons()
  const selectedIds = useSelectionStore((state) => state.selectedIds)
  const count = useSelectionStore((state) => state.count)
  const clear = useSelectionStore((state) => state.clear)
  const size = useExportStore((state) => state.size)
  const format = useExportStore((state) => state.format)
  const isValid = useExportStore((state) => state.isValid)
  const selectedColor = useColorStore((state) => state.selectedColor)
  const style = useFilterStore((state) => state.style)

  const [isExporting, setIsExporting] = useState(false)

  const canExport = count > 0 && isValid()

  const handleExport = async () => {
    if (!canExport || !icons || !size || !format) return

    setIsExporting(true)

    try {
      const selectedIcons = icons.filter((icon) => selectedIds.has(icon.id))

      const iconData = await Promise.all(
        selectedIcons.map(async (icon) => {
          const path = icon.files[style]
          if (!path) throw new Error(`No ${style} variant for ${icon.id}`)
          const svg = await fetchSvg(path)
          return { id: icon.id, svg }
        })
      )

      const blob = await exportToZip(iconData, {
        size,
        format,
        color: selectedColor,
      })

      const filename = `some-icons-${style}-${size}px.zip`
      downloadBlob(blob, filename)

      toast.success(`Exported ${count} icon${count > 1 ? 's' : ''}`)
      clear()
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={!canExport || isExporting}
      className={`
        w-full h-11 rounded-[10px] text-sm font-semibold
        transition-all duration-200
        flex items-center justify-center mt-1
        ${canExport && !isExporting
          ? 'bg-[var(--cta-bg)] text-[var(--cta-fg)] hover:bg-[var(--cta-bg-hover)] hover:-translate-y-px active:translate-y-0 cursor-pointer'
          : 'bg-[var(--cta-bg-disabled)] text-[var(--cta-fg)] cursor-not-allowed'
        }
      `}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        'Export'
      )}
    </button>
  )
}
