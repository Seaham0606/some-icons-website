import { ColorHexField } from '@/components/home/BulkColorPickerPanel'
import { CodeSnippet, CodeSnippetGroup } from '@/components/info/CodeSnippetGroup'
import { IconPreviewCard } from '@/components/info/IconPreviewCard'
import { ReactInstallModal } from '@/components/info/ReactInstallModal'
import { ReactSnippetLazy } from '@/components/info/ReactSnippetLazy'
import { SvgSnippetLazy } from '@/components/info/SvgSnippetLazy'
import { fetchSvg } from '@/lib/api'
import { useIcons } from '@/hooks/useIcons'
import {
  buildReactImportStatement,
  buildReactJsxUsageLine,
  iconIdToReactExportName,
  orderedSelectionIconIds,
  REACT_PACKAGE,
  reactJsxUsageLinesForSelection,
} from '@/lib/code-export'
import { DEFAULT_ICON_SIZE, SIZE_PRESETS } from '@/lib/constants'
import { createExportBlobForIcon, exportToZip, downloadBlob } from '@/lib/export-utils'
import { applyColorToSvg, ensureViewBox, setSvgDimensions } from '@/lib/svg-utils'
import { trackDownload } from '@/lib/analytics'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useFilterStore } from '@/stores/filterStore'
import { useSelectionStore } from '@/stores/selectionStore'
import type { Icon } from '@/types/icon'
import {
  Input,
  InputField,
  InputSection,
  SegmentedControl,
  SomeIcon,
} from 'design-system'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { toast } from 'sonner'

const EXPORT_SIZE_OPTIONS = SIZE_PRESETS.map((size) => ({
  value: size,
  label: String(size),
}))

export interface IconInfoPanelContentProps {
  icon: Icon
}

export function IconInfoPanelContent({ icon }: IconInfoPanelContentProps) {
  const exportSize = useExportStore((s) => s.size)
  const setExportSize = useExportStore((s) => s.setSize)
  const showExportValidation = useExportStore((s) => s.showValidationErrors)
  const setShowValidationErrors = useExportStore((s) => s.setShowValidationErrors)
  const validateExport = useExportStore((s) => s.validate)
  const { sizeValid } = validateExport()
  const sizeFieldError = showExportValidation && !sizeValid
  const selectedColor = useColorStore((s) => s.selectedColor)
  const setSelectedColor = useColorStore((s) => s.setColor)
  const resetSelectedColor = useColorStore((s) => s.reset)
  const style = useFilterStore((s) => s.style)
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const selectionCount = useSelectionStore((s) => s.count)
  const { data: allIcons } = useIcons()

  const selectedIcons = useMemo(() => {
    if (selectionCount <= 1 || allIcons == null) return undefined
    return orderedSelectionIconIds(selectedIds)
      .map((id) => allIcons.find((ic) => ic.id === id))
      .filter((ic): ic is NonNullable<typeof ic> => ic != null)
  }, [selectionCount, selectedIds, allIcons])

  const selectionCategoryLabel = useMemo(() => {
    if (!selectedIcons || selectedIcons.length === 0) return icon.category
    const first = selectedIcons[0].category
    return selectedIcons.every((ic) => ic.category === first) ? first : 'Multiple categories'
  }, [selectedIcons, icon.category])

  const [isDownloading, setIsDownloading] = useState(false)
  const [customExportSize, setCustomExportSize] = useState('')
  const [activeSnippetTab, setActiveSnippetTab] = useState<'react' | 'svg'>('react')
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [svgSnippetCode, setSvgSnippetCode] = useState<string>('')
  const [svgSnippetLoading, setSvgSnippetLoading] = useState(false)

  useEffect(() => {
    if (selectionCount > 1 && activeSnippetTab === 'svg') {
      setActiveSnippetTab('react')
    }
  }, [selectionCount, activeSnippetTab])

  useEffect(() => {
    if (activeSnippetTab !== 'svg') return
    const path = icon.files[style]
    if (!path) {
      setSvgSnippetCode('<!-- No SVG available for this style -->')
      return
    }
    let cancelled = false
    setSvgSnippetLoading(true)
    fetchSvg(path)
      .then((svg) => {
        if (cancelled) return
        let processed = ensureViewBox(svg)
        processed = applyColorToSvg(processed, selectedColor)
        if (exportSize != null) {
          processed = setSvgDimensions(processed, exportSize)
        }
        /* File SVGs usually end with \n; Prism renders that as a blank last line. */
        setSvgSnippetCode(processed.trimEnd())
      })
      .catch(() => {
        if (!cancelled) setSvgSnippetCode('<!-- Error loading SVG -->')
      })
      .finally(() => {
        if (!cancelled) setSvgSnippetLoading(false)
      })
    return () => { cancelled = true }
  }, [activeSnippetTab, icon, style, selectedColor, exportSize])

  const reactSnippetParts = useMemo(() => {
    const size = exportSize ?? DEFAULT_ICON_SIZE
    if (selectionCount > 0) {
      const orderedIds = orderedSelectionIconIds(selectedIds)
      const exportNames = orderedIds.map((id) => iconIdToReactExportName(id, style))
      const uniqueNames = [...new Set(exportNames)]
      const importCode = buildReactImportStatement(uniqueNames)
      const usageLines = reactJsxUsageLinesForSelection(orderedIds, style, size, selectedColor ?? null)
      const usageCode =
        usageLines.length === 1
          ? usageLines[0]
          : `<>\n${usageLines.map((l) => `  ${l}`).join('\n')}\n</>`
      return { importCode, usageCode }
    }
    const exportName = iconIdToReactExportName(icon.id, style)
    return {
      importCode: buildReactImportStatement([exportName]),
      usageCode: buildReactJsxUsageLine(exportName, size, selectedColor ?? null),
    }
  }, [icon.id, style, exportSize, selectedColor, selectionCount, selectedIds])

  const [snippetCopied, setSnippetCopied] = useState<'import' | 'usage' | 'svg' | null>(null)
  const snippetCopiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (snippetCopiedTimerRef.current != null) {
        clearTimeout(snippetCopiedTimerRef.current)
      }
    }
  }, [])

  const flashSnippetCopied = useCallback((which: 'import' | 'usage' | 'svg') => {
    setSnippetCopied(which)
    if (snippetCopiedTimerRef.current != null) {
      clearTimeout(snippetCopiedTimerRef.current)
    }
    snippetCopiedTimerRef.current = setTimeout(() => {
      setSnippetCopied(null)
      snippetCopiedTimerRef.current = null
    }, 1000)
  }, [])

  const sizePresetValue = useMemo((): (typeof SIZE_PRESETS)[number] | null => {
    if (exportSize == null) return null
    return (SIZE_PRESETS as readonly number[]).includes(exportSize)
      ? (exportSize as (typeof SIZE_PRESETS)[number])
      : null
  }, [exportSize])

  const handleExportPresetSize = useCallback(
    (preset: (typeof SIZE_PRESETS)[number]) => {
      setExportSize(preset)
      setCustomExportSize('')
    },
    [setExportSize],
  )

  const handleCustomSizeChange = useCallback(
    (raw: string) => {
      const digits = raw.replace(/\D/g, '')
      setCustomExportSize(digits)
      const num = parseInt(digits, 10)
      if (!isNaN(num) && num > 0) {
        setExportSize(num)
      } else if (digits === '') {
        setExportSize(null)
      }
    },
    [setExportSize],
  )

  const handleCustomSizeKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
      e.preventDefault()
      const delta = e.key === 'ArrowUp' ? 1 : -1
      const raw = e.currentTarget.value
      const digitsOnly = raw.replace(/\D/g, '')
      const parsed = parseInt(digitsOnly, 10)
      const hasTypedDigits = digitsOnly !== '' && !isNaN(parsed)
      const base = hasTypedDigits
        ? parsed
        : exportSize != null && exportSize > 0
          ? exportSize
          : 0
      const next = base + delta
      if (next < 1) {
        handleCustomSizeChange('')
        return
      }
      handleCustomSizeChange(String(next))
    },
    [exportSize, handleCustomSizeChange],
  )

  const handleResetExportSize = useCallback(() => {
    setExportSize(null)
    setCustomExportSize('')
  }, [setExportSize])

  const handleResetExportColor = useCallback(() => {
    resetSelectedColor()
  }, [resetSelectedColor])

  const showSizeReset = exportSize !== null || customExportSize !== ''
  const showColorReset = selectedColor !== null

  const handleCopySnippetSection = useCallback(
    async (text: string, which: 'import' | 'usage' | 'svg') => {
      try {
        await navigator.clipboard.writeText(text)
        flashSnippetCopied(which)
      } catch (error) {
        console.error('Clipboard copy failed:', error)
        toast.error('Could not copy. Check clipboard permissions.')
      }
    },
    [flashSnippetCopied],
  )

  const handleDownload = useCallback(
    async () => {
      if (!sizeValid) {
        setShowValidationErrors(true)
        return
      }

      const effectiveSize = exportSize ?? DEFAULT_ICON_SIZE
      const exportOpts = { size: effectiveSize, color: selectedColor }

      setIsDownloading(true)
      try {
        if (selectionCount > 1 && allIcons != null) {
          const iconsToExport = [...selectedIds]
            .map((id) => allIcons.find((ic) => ic.id === id))
            .filter((ic): ic is NonNullable<typeof ic> => ic != null)

          const iconData = await Promise.all(
            iconsToExport.map(async (ic) => {
              const path = ic.files[style]
              if (!path) throw new Error(`No ${style} variant for ${ic.id}`)
              const svg = await fetchSvg(path)
              return { id: ic.id, svg }
            }),
          )

          const blob = await exportToZip(iconData, exportOpts)
          downloadBlob(blob, `some-icons-${style}-${effectiveSize}px.zip`)
          trackDownload({
            format: 'svg',
            style,
            size: effectiveSize,
            count: selectionCount,
            is_zip: true,
          })
        } else {
          const path = icon.files[style]
          if (!path) throw new Error(`No ${style} variant for ${icon.id}`)
          const svg = await fetchSvg(path)
          const blob = await createExportBlobForIcon(svg, exportOpts)
          downloadBlob(blob, `${icon.id}.svg`)
          trackDownload({
            format: 'svg',
            style,
            size: effectiveSize,
            count: 1,
            is_zip: false,
          })
        }
      } catch (error) {
        console.error('Download failed:', error)
        toast.error('Download failed. Please try again.')
      } finally {
        setIsDownloading(false)
      }
    },
    [
      icon,
      exportSize,
      selectedColor,
      style,
      sizeValid,
      setShowValidationErrors,
      selectionCount,
      selectedIds,
      allIcons,
    ],
  )

  return (
    <div className="homepage-infoPanelShell">
      <IconPreviewCard
        icon={icon}
        exportSize={exportSize}
        selectionCount={selectionCount}
        selectionCategoryLabel={selectionCategoryLabel}
        selectedIcons={selectedIcons}
        isDownloading={isDownloading}
        onDownload={handleDownload}
      />

      <InputSection
        className="homepage-infoPanelShellBody"
        showLabel={false}
        contentScrollable
        contentSlot={
          <div className="homepage-infoPanelContent">
            {/* Row 1: Size */}
            <InputField
              className="homepage-infoPanelContent__sizeField"
              label="Size"
              showCol2
              col2Width="size-12"
              data-slot="infoPanel-size"
              labelTrailingSlot={
                showSizeReset ? (
                  <button
                    type="button"
                    className="label-xs homepage-infoPanel-labelReset"
                    aria-label="Reset size to default"
                    onClick={handleResetExportSize}
                  >
                    Reset
                  </button>
                ) : undefined
              }
              contentSlot={
                <SegmentedControl
                  options={EXPORT_SIZE_OPTIONS}
                  value={sizePresetValue}
                  onChange={handleExportPresetSize}
                  hasError={sizeFieldError}
                />
              }
              secondarySlot={
                <Input
                  className="homepage-infoPanelContent__sizeCustomInput"
                  aria-label="Custom icon size in pixels"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputClassName="ds-nativeInput--numeric"
                  status={sizeFieldError ? 'error' : 'default'}
                  value={customExportSize}
                  onKeyDown={handleCustomSizeKeyDown}
                  onChange={(e) => handleCustomSizeChange(e.target.value)}
                />
              }
            />

            {/* Row 2: Color */}
            <InputField
              className="homepage-infoPanelContent__colorField"
              label="Color"
              data-slot="infoPanel-color"
              labelTrailingSlot={
                showColorReset ? (
                  <button
                    type="button"
                    className="label-xs homepage-infoPanel-labelReset"
                    aria-label="Reset color to default"
                    onClick={handleResetExportColor}
                  >
                    Reset
                  </button>
                ) : undefined
              }
              contentSlot={
                <div className="homepage-infoPanel-colorHexWrap">
                  <ColorHexField color={selectedColor} onColorChange={setSelectedColor} />
                </div>
              }
            />

            {/* Row 3: Code snippets */}
            <CodeSnippetGroup
              tabs={[
                {
                  id: 'react',
                  label: 'React',
                  trailingSlot: (
                    <button
                      type="button"
                      className="ds-chipTrailingBtn"
                      aria-label="How to install the React package"
                      onClick={() => setShowInstallModal(true)}
                    >
                      <SomeIcon
                        iconName="symbol-information-circle"
                        iconStyle="fill"
                        iconSize="xs"
                        padding="0"
                      />
                    </button>
                  ),
                },
                { id: 'svg', label: 'SVG', disabled: selectionCount > 1 },
              ]}
              activeTab={activeSnippetTab}
              onTabChange={(id) => setActiveSnippetTab(id as 'react' | 'svg')}
              contentSlot={
                activeSnippetTab === 'react' ? (
                  <>
                    <div className="rii-codeFrame">
                      <CodeSnippet
                        label="Import"
                        copied={snippetCopied === 'import'}
                        onCopy={() => void handleCopySnippetSection(reactSnippetParts.importCode, 'import')}
                        copyAriaLabel={snippetCopied === 'import' ? 'Copied import' : 'Copy import'}
                        data-slot="infoPanel-snippet-import"
                      >
                        <ReactSnippetLazy
                          code={reactSnippetParts.importCode}
                          className="rii-codeBlock"
                        />
                      </CodeSnippet>
                    </div>
                    <div className="rii-codeFrame">
                      <CodeSnippet
                        label="Usage"
                        copied={snippetCopied === 'usage'}
                        onCopy={() => void handleCopySnippetSection(reactSnippetParts.usageCode, 'usage')}
                        copyAriaLabel={snippetCopied === 'usage' ? 'Copied usage' : 'Copy usage'}
                        data-slot="infoPanel-snippet-usage"
                      >
                        <ReactSnippetLazy
                          code={reactSnippetParts.usageCode}
                          className="rii-codeBlock"
                        />
                      </CodeSnippet>
                    </div>
                  </>
                ) : (
                  <div className="rii-codeFrame">
                    <CodeSnippet
                      label="Markup"
                      copied={snippetCopied === 'svg'}
                      onCopy={() => void handleCopySnippetSection(svgSnippetCode, 'svg')}
                      copyAriaLabel={snippetCopied === 'svg' ? 'Copied SVG' : 'Copy SVG'}
                      copyDisabled={svgSnippetLoading || svgSnippetCode === ''}
                      data-slot="infoPanel-snippet-svg-block"
                    >
                      {svgSnippetLoading ? (
                        <pre className="rii-codeBlock" style={{ margin: 0 }}>
                          <code>Loading…</code>
                        </pre>
                      ) : (
                        <SvgSnippetLazy code={svgSnippetCode} className="rii-codeBlock" />
                      )}
                    </CodeSnippet>
                  </div>
                )
              }
            />
          </div>
        }
      />

      <ReactInstallModal
        open={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        packageName={REACT_PACKAGE}
        selectedIconName={iconIdToReactExportName(icon.id, style)}
      />
    </div>
  )
}
