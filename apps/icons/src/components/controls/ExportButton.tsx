import { useSelectionStore } from '@/stores/selectionStore'
import { useExportStore } from '@/stores/exportStore'
import { useColorStore } from '@/stores/colorStore'
import { useFilterStore } from '@/stores/filterStore'
import { useIcons } from '@/hooks/useIcons'
import { exportToZip, downloadBlob } from '@/lib/export-utils'
import { fetchSvg } from '@/lib/api'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

export function ExportButton() {
  const { data: icons } = useIcons()
  const selectedIds = useSelectionStore((state) => state.selectedIds)
  const count = useSelectionStore((state) => state.count)
  const clear = useSelectionStore((state) => state.clear)
  const size = useExportStore((state) => state.size)
  const format = useExportStore((state) => state.format)
  const isValid = useExportStore((state) => state.isValid)
  const setShowValidationErrors = useExportStore((state) => state.setShowValidationErrors)
  const selectedColor = useColorStore((state) => state.selectedColor)
  const style = useFilterStore((state) => state.style)

  const [isExporting, setIsExporting] = useState(false)
  const [showNoIconsTooltip, setShowNoIconsTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check theme
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(theme === 'dark' || (!theme && prefersDark))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', checkTheme)
    }
  }, [])

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (showNoIconsTooltip) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowNoIconsTooltip(false)
      }, 3000)
    }
    
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [showNoIconsTooltip])

  const handleExport = async () => {
    if (!count || !icons) {
      // Show tooltip if no icons selected
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
        })
        setShowNoIconsTooltip(true)
      }
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
        })
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
  }

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={handleExport}
        disabled={isExporting}
        fullWidth
        className={cn('rounded-[10px]')}
      >
      {isExporting ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin">
            <CdnIcon iconId="interface-loading" className="h-4 w-4" />
          </div>
          Downloading...
        </>
      ) : (
        count > 0 ? (
          <span>Download <span className="font-bold">{count}</span> icon{count > 1 ? 's' : ''}</span>
        ) : (
          <span className="font-semibold">Download</span>
        )
      )}
    </Button>

    {/* Tooltip for no icons selected */}
    {showNoIconsTooltip && (
      <div
        className={cn(
          "fixed pointer-events-none z-50 pl-2 pr-4 py-1 rounded-[999px] text-base font-medium whitespace-nowrap flex items-center gap-1.5 backdrop-blur-[10px]",
          isDark ? "text-white" : "text-black"
        )}
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translate(-50%, -100%)',
          backgroundColor: isDark 
            ? 'var(--color-white-alpha-100)' 
            : 'var(--color-black-alpha-100)',
        }}
      >
        <CdnIcon iconId="symbol-warning-circle" className="w-4 h-4" />
        Please select icons to download
      </div>
    )}
    </>
  )
}
