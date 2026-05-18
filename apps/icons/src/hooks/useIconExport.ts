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
import { trackDownload, trackCopy } from '@/lib/analytics'
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
 * Export flow: **copy** (SVG markup or React code to clipboard) and **download** (SVG files or ZIP).
 * With multiple icons selected, copy is only supported for React code; SVG copy is single-icon only.
 * Bulk actions only mount when there is a selection, so handlers assume `count > 0` in normal UI use.
 * Returns whether the operation completed successfully (for in-UI feedback); errors still use `toast`.
 */
export function useIconExport() {
  const { data: icons } = useIcons()
  const selectedIds = useSelectionStore((state) => state.selectedIds)
  const count = useSelectionStore((state) => state.count)
  const size = useExportStore((state) => state.size)
  const copyFormat = useExportStore((state) => state.copyFormat)
  const isValid = useExportStore((state) => state.isValid)
  const setShowValidationErrors = useExportStore(
    (state) => state.setShowValidationErrors,
  )
  const selectedColor = useColorStore((state) => state.selectedColor)
  const style = useFilterStore((state) => state.style)

  const [isCopying, setIsCopying] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleCopy = useCallback(async (): Promise<boolean> => {
    if (!count) return false

    if (copyFormat === 'svg' && count > 1) {
      toast.error(
        'Copy for multiple icons is only available as React code. Choose React under Copy as.',
      )
      return false
    }

    if (copyFormat === 'code') {
      if (!isValid() || !size) {
        setShowValidationErrors(true)
        return false
      }
      const orderedIds = Array.from(selectedIds)
      const snippet = generateFrameworkCodeSnippet(getDefaultCodeFramework(), {
        orderedIconIds: orderedIds,
        style,
        size,
        colorHex: selectedColor,
      })
      try {
        await navigator.clipboard.writeText(snippet)
        trackCopy({ format: 'react', style, size, count })
        return true
      } catch (error) {
        console.error('Clipboard copy failed:', error)
        toast.error('Could not copy. Check clipboard permissions.')
        return false
      }
    }

    if (copyFormat !== 'svg') return false

    if (!icons) return false

    if (!isValid() || !size) {
      setShowValidationErrors(true)
      return false
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
      const parts = iconData.map(({ svg }) => {
        const processed = processSvgForExport(svg, size, selectedColor)
        return processed
      })
      await navigator.clipboard.writeText(parts.join('\n\n'))
      trackCopy({ format: 'svg', style, size, count })
      return true
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Could not copy. Check clipboard permissions.')
      return false
    } finally {
      setIsCopying(false)
    }
  }, [
    copyFormat,
    count,
    icons,
    isValid,
    selectedColor,
    selectedIds,
    setShowValidationErrors,
    size,
    style,
  ])

  const handleDownload = useCallback(async (): Promise<boolean> => {
    if (!count) return false

    if (!icons) {
      return false
    }

    if (!isValid() || !size) {
      setShowValidationErrors(true)
      return false
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
        color: selectedColor,
      }

      if (count === 1) {
        const { id, svg } = iconData[0]
        const blob = await createExportBlobForIcon(svg, exportOpts)
        downloadBlob(blob, `${id}.svg`)
      } else {
        const blob = await exportToZip(iconData, exportOpts)
        const filename = `some-icons-${style}-${size}px.zip`
        downloadBlob(blob, filename)
      }
      trackDownload({ format: 'svg', style, size, count, is_zip: count > 1 })
      return true
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
      return false
    } finally {
      setIsDownloading(false)
    }
  }, [
    count,
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
