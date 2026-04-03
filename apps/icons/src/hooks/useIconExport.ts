import { useSelectionStore } from '@/stores/selectionStore'
import { useExportStore } from '@/stores/exportStore'
import { useColorStore } from '@/stores/colorStore'
import { useFilterStore } from '@/stores/filterStore'
import { useIcons } from '@/hooks/useIcons'
import {
  createExportBlobForIcon,
  exportToZip,
  downloadBlob,
} from '@/lib/export-utils'
import { fetchSvg } from '@/lib/api'
import {
  generateFrameworkCodeSnippet,
  getDefaultCodeFramework,
} from '@/lib/code-export'
import { applyColorToSvg, ensureViewBox, setSvgDimensions } from '@/lib/svg-utils'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

function processSvgForExport(
  svg: string,
  size: number,
  color: string | null,
): string {
  let processed = ensureViewBox(svg)
  processed = applyColorToSvg(processed, color)
  return setSvgDimensions(processed, size)
}

/**
 * Export flow: **copy** (SVG markup or React code to clipboard) and **download** (SVG/PNG files).
 * Bulk actions only mount when there is a selection, so handlers assume `count > 0` in normal UI use.
 */
export function useIconExport() {
  const { data: icons } = useIcons()
  const selectedIds = useSelectionStore((state) => state.selectedIds)
  const count = useSelectionStore((state) => state.count)
  const clear = useSelectionStore((state) => state.clear)
  const size = useExportStore((state) => state.size)
  const format = useExportStore((state) => state.format)
  const isValid = useExportStore((state) => state.isValid)
  const setShowValidationErrors = useExportStore(
    (state) => state.setShowValidationErrors,
  )
  const selectedColor = useColorStore((state) => state.selectedColor)
  const style = useFilterStore((state) => state.style)

  const [isCopying, setIsCopying] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!count) return

    if (format === 'png') {
      toast.error('Copy is only available for SVG and Code formats.')
      return
    }

    if (format === 'code') {
      if (!isValid() || !size) {
        setShowValidationErrors(true)
        return
      }
      const orderedIds = Array.from(selectedIds)
      const snippet = generateFrameworkCodeSnippet(getDefaultCodeFramework(), {
        orderedIconIds: orderedIds,
        style,
        size,
      })
      try {
        await navigator.clipboard.writeText(snippet)
        toast.success('Copied React code to clipboard')
      } catch (error) {
        console.error('Clipboard copy failed:', error)
        toast.error('Could not copy. Check clipboard permissions.')
      }
      return
    }

    if (format !== 'svg') return

    if (!icons) return

    if (!isValid() || !size) {
      setShowValidationErrors(true)
      return
    }

    setIsCopying(true)
    try {
      const selectedIcons = icons.filter((icon) => selectedIds.has(icon.id))
      const iconData = await Promise.all(
        selectedIcons.map(async (icon) => {
          const path = icon.files[style]
          if (!path) throw new Error(`No ${style} variant for ${icon.id}`)
          const svg = await fetchSvg(path)
          return { id: icon.id, svg }
        }),
      )
      const parts = iconData.map(({ id, svg }) => {
        const processed = processSvgForExport(svg, size, selectedColor)
        return count > 1 ? `<!-- ${id}.svg -->\n${processed}` : processed
      })
      await navigator.clipboard.writeText(parts.join('\n\n'))
      toast.success(count === 1 ? 'Copied SVG to clipboard' : `Copied ${count} SVGs to clipboard`)
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Could not copy. Check clipboard permissions.')
    } finally {
      setIsCopying(false)
    }
  }, [
    count,
    format,
    icons,
    isValid,
    selectedColor,
    selectedIds,
    setShowValidationErrors,
    size,
    style,
  ])

  const handleDownload = useCallback(async () => {
    if (!count) return

    if (format === 'code') {
      toast.error('Use Copy for Code format.')
      return
    }

    if (!icons) {
      return
    }

    if (!isValid() || !size || !format) {
      setShowValidationErrors(true)
      return
    }

    setIsDownloading(true)

    try {
      const selectedIcons = icons.filter((icon) => selectedIds.has(icon.id))

      const iconData = await Promise.all(
        selectedIcons.map(async (icon) => {
          const path = icon.files[style]
          if (!path) throw new Error(`No ${style} variant for ${icon.id}`)
          const svg = await fetchSvg(path)
          return { id: icon.id, svg }
        }),
      )

      const exportOpts = {
        size,
        format,
        color: selectedColor,
      } as const

      if (count === 1) {
        const { id, svg } = iconData[0]
        const blob = await createExportBlobForIcon(svg, exportOpts)
        const ext = format === 'svg' ? 'svg' : 'png'
        downloadBlob(blob, `${id}.${ext}`)
        toast.success('Downloaded icon')
      } else {
        const blob = await exportToZip(iconData, exportOpts)
        const filename = `some-icons-${style}-${size}px.zip`
        downloadBlob(blob, filename)
        toast.success(`Downloaded ${count} icons`)
      }
      clear()
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }, [
    clear,
    count,
    format,
    icons,
    isValid,
    selectedColor,
    selectedIds,
    setShowValidationErrors,
    size,
    style,
  ])

  return {
    handleCopy,
    handleDownload,
    isCopying,
    isDownloading,
    selectionCount: count,
  }
}
