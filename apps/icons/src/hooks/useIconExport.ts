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
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Export flow: SVG/PNG as a single file when one icon is selected, ZIP when multiple;
 * Code (React): clipboard snippet (import + JSX). UI: `ExportNoSelectionTooltip`
 * when export is invoked with no selection.
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

  const [isExporting, setIsExporting] = useState(false)
  const [noSelectionFeedback, setNoSelectionFeedback] = useState<{
    x: number
    y: number
    isDark: boolean
  } | null>(null)
  const buttonWrapRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!noSelectionFeedback) return

    tooltipTimeoutRef.current = setTimeout(() => {
      setNoSelectionFeedback(null)
    }, 3000)

    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }
    }
  }, [noSelectionFeedback])

  const handleExport = useCallback(async () => {
    if (!count) {
      const el = buttonWrapRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const theme = document.documentElement.getAttribute('data-theme')
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
        const isDark = theme === 'dark' || (!theme && prefersDark)
        setNoSelectionFeedback({
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
          isDark,
        })
      }
      return
    }

    if (format === 'code') {
      const orderedIds = Array.from(selectedIds)
      const snippet = generateFrameworkCodeSnippet(getDefaultCodeFramework(), {
        orderedIconIds: orderedIds,
        style,
        size: size ?? 24,
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

    if (!icons) {
      return
    }

    if (!isValid() || !size || !format) {
      setShowValidationErrors(true)
      return
    }

    setIsExporting(true)

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
      setIsExporting(false)
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
    handleExport,
    isExporting,
    selectionCount: count,
    buttonWrapRef,
    noSelectionFeedback,
  }
}
