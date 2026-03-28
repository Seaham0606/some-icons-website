import { useSelectionStore } from '@/stores/selectionStore'
import { useExportStore } from '@/stores/exportStore'
import { useColorStore } from '@/stores/colorStore'
import { useFilterStore } from '@/stores/filterStore'
import { useIcons } from '@/hooks/useIcons'
import { exportToZip, downloadBlob } from '@/lib/export-utils'
import { fetchSvg } from '@/lib/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/** Icons-app export flow (ZIP). UI: DS `Button` + `ExportNoSelectionTooltip` when needed. */
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

      const blob = await exportToZip(iconData, {
        size,
        format,
        color: selectedColor,
      })

      const filename = `some-icons-${style}-${size}px.zip`
      downloadBlob(blob, filename)

      toast.success(`Downloaded ${count} icon${count > 1 ? 's' : ''}`)
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
