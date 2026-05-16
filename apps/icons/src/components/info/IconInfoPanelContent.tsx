import { BulkColorPickerPanel } from '@/components/home/BulkColorPickerPanel'
import { IconWireframe } from '@/components/info/IconWireframe'
import { ReactSnippetLazy } from '@/components/info/ReactSnippetLazy'
import { BULK_COPY_STATE_ICONS } from '@/lib/bulk-copy-state-icons'
import { fetchSvg } from '@/lib/api'
import {
  buildReactImportStatement,
  buildReactJsxUsageLine,
  generateFrameworkCodeSnippet,
  getDefaultCodeFramework,
  iconIdToReactExportName,
} from '@/lib/code-export'
import { DEFAULT_ICON_SIZE, SIZE_PRESETS } from '@/lib/constants'
import { createExportBlobForIcon, downloadBlob } from '@/lib/export-utils'
import { applyColorToSvg, ensureViewBox, setSvgDimensions } from '@/lib/svg-utils'
import { trackCopy, trackDownload } from '@/lib/analytics'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useFilterStore } from '@/stores/filterStore'
import { useBulkActionStripFeedback } from '@/hooks/useBulkActionStripFeedback'
import type { Icon } from '@/types/icon'
import {
  BulkActionBarSettingsPanel,
  Button,
  Chip,
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
  const copyFormat = useExportStore((s) => s.copyFormat)
  const downloadFormat = useExportStore((s) => s.downloadFormat)
  const setCopyFormat = useExportStore((s) => s.setCopyFormat)
  const setDownloadFormat = useExportStore((s) => s.setDownloadFormat)
  const { sizeValid } = validateExport()
  const sizeFieldError = showExportValidation && !sizeValid
  const selectedColor = useColorStore((s) => s.selectedColor)
  const setSelectedColor = useColorStore((s) => s.setColor)
  const style = useFilterStore((s) => s.style)

  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [customExportSize, setCustomExportSize] = useState('')

  const colorPickerAnchorRef = useRef<HTMLDivElement>(null)
  const settingsAnchorRef = useRef<HTMLDivElement>(null)

  const {
    copySuccessStrip,
    downloadSuccessStrip,
    flashCopySuccess,
    flashDownloadSuccess,
  } = useBulkActionStripFeedback()

  useEffect(() => {
    if (!colorPickerOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target instanceof Node ? e.target : null
      if (!node) return
      if (colorPickerAnchorRef.current?.contains(node)) return
      setColorPickerOpen(false)
    }
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setColorPickerOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [colorPickerOpen])

  useEffect(() => {
    if (!settingsPanelOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target instanceof Node ? e.target : null
      if (!node) return
      if (settingsAnchorRef.current?.contains(node)) return
      setSettingsPanelOpen(false)
    }
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsPanelOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [settingsPanelOpen])

  const reactSnippetParts = useMemo(() => {
    const exportName = iconIdToReactExportName(icon.id, style)
    const size = exportSize ?? DEFAULT_ICON_SIZE
    return {
      importCode: buildReactImportStatement([exportName]),
      usageCode: buildReactJsxUsageLine(
        exportName,
        size,
        selectedColor ?? null,
      ),
    }
  }, [icon.id, style, exportSize, selectedColor])

  const [snippetCopied, setSnippetCopied] = useState<'import' | 'usage' | null>(
    null,
  )
  const snippetCopiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  useEffect(() => {
    return () => {
      if (snippetCopiedTimerRef.current != null) {
        clearTimeout(snippetCopiedTimerRef.current)
      }
    }
  }, [])

  const flashSnippetCopied = useCallback((which: 'import' | 'usage') => {
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

  const handleCopySnippetSection = useCallback(
    async (text: string, which: 'import' | 'usage') => {
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

  const handleCopy = useCallback(async () => {
    if (!sizeValid || exportSize == null) {
      setShowValidationErrors(true)
      return
    }

    if (copyFormat === 'code') {
      const snippet = generateFrameworkCodeSnippet(getDefaultCodeFramework(), {
        orderedIconIds: [icon.id],
        style,
        size: exportSize,
        colorHex: selectedColor,
      })
      try {
        await navigator.clipboard.writeText(snippet)
        trackCopy({ format: 'react', style, size: exportSize, count: 1 })
        flashCopySuccess()
      } catch (error) {
        console.error('Clipboard copy failed:', error)
        toast.error('Could not copy. Check clipboard permissions.')
      }
      return
    }

    if (copyFormat === 'svg') {
      setIsCopying(true)
      try {
        const path = icon.files[style]
        if (!path) throw new Error(`No ${style} variant for ${icon.id}`)
        const svg = await fetchSvg(path)
        let processed = ensureViewBox(svg)
        processed = applyColorToSvg(processed, selectedColor)
        processed = setSvgDimensions(processed, exportSize)
        await navigator.clipboard.writeText(processed)
        trackCopy({ format: 'svg', style, size: exportSize, count: 1 })
        flashCopySuccess()
      } catch (error) {
        console.error('Copy failed:', error)
        toast.error('Could not copy. Check clipboard permissions.')
      } finally {
        setIsCopying(false)
      }
    }
  }, [
    icon,
    copyFormat,
    exportSize,
    selectedColor,
    style,
    sizeValid,
    setShowValidationErrors,
    flashCopySuccess,
  ])

  const handleDownload = useCallback(async () => {
    if (!sizeValid || exportSize == null) {
      setShowValidationErrors(true)
      return
    }

    setIsDownloading(true)
    try {
      const path = icon.files[style]
      if (!path) throw new Error(`No ${style} variant for ${icon.id}`)
      const svg = await fetchSvg(path)
      const blob = await createExportBlobForIcon(svg, {
        size: exportSize,
        format: downloadFormat,
        color: selectedColor,
      })
      const ext = downloadFormat === 'svg' ? 'svg' : 'png'
      downloadBlob(blob, `${icon.id}.${ext}`)
      trackDownload({ format: downloadFormat, style, size: exportSize, count: 1, is_zip: false })
      flashDownloadSuccess()
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }, [
    icon,
    downloadFormat,
    exportSize,
    selectedColor,
    style,
    sizeValid,
    setShowValidationErrors,
    flashDownloadSuccess,
  ])

  const copyLabel = copySuccessStrip
    ? copyFormat === 'code' ? 'Copied React' : 'Copied SVG'
    : copyFormat === 'code' ? 'Copy React' : 'Copy SVG'

  const downloadLabel = downloadSuccessStrip
    ? `Downloaded ${downloadFormat.toUpperCase()}`
    : `Download ${downloadFormat.toUpperCase()}`

  return (
    <div className="homepage-infoPanelShell">
      <InputSection
        className="homepage-infoPanelShellPreview"
        showLabel={false}
        contentSlot={
          <div
            className="homepage-infoPanelWireframeShell"
            data-slot="infoPanel-preview-shell"
            role="group"
            aria-label={`${icon.id}, ${icon.category}`}
          >
            <IconWireframe icon={icon} />
            <div
              className="homepage-infoPanelWireframeOverlay homepage-infoPanelWireframeOverlay--token"
              data-slot="infoPanel-meta-token"
            >
              <Chip variant="neutral" backdropBlur>
                {icon.id}
              </Chip>
            </div>
            <div
              className="homepage-infoPanelWireframeOverlay homepage-infoPanelWireframeOverlay--category"
              data-slot="infoPanel-meta-category"
            >
              <Chip variant="neutral" backdropBlur>
                {icon.category}
              </Chip>
            </div>
          </div>
        }
      />

      <InputSection
        className="homepage-infoPanelShellBody"
        showLabel={false}
        contentSlot={
          <div className="homepage-infoPanelContent">
            <div
              className="homepage-infoPanelContent__controlsRow"
              data-slot="infoPanel-controls"
            >
              <div ref={colorPickerAnchorRef} className="homepage-infoPanel-colorAnchor">
                {colorPickerOpen ? (
                  <div className="homepage-infoPanel-colorPop">
                    <BulkColorPickerPanel
                      color={selectedColor}
                      onColorChange={setSelectedColor}
                    />
                  </div>
                ) : null}
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="md"
                  className="homepage-bulkAction-colorBtn"
                  aria-label="Icon color"
                  aria-haspopup="dialog"
                  aria-expanded={colorPickerOpen}
                  data-color-active={selectedColor != null ? 'true' : undefined}
                  onClick={() => setColorPickerOpen((o) => !o)}
                  leadingSlot={
                    selectedColor != null ? (
                      <span
                        className="homepage-bulkAction-colorDot"
                        style={{ backgroundColor: selectedColor }}
                        aria-hidden
                      />
                    ) : (
                      <SomeIcon
                        iconName="formatting-eyedropper"
                        iconStyle="outline"
                        iconSize="md"
                        padding="0"
                      />
                    )
                  }
                />
              </div>

              <InputField
                className="homepage-infoPanelContent__sizeField"
                showLabel={false}
                showCol2
                col2Width="size-12"
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
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    placeholder="px"
                    status={sizeFieldError ? 'error' : 'default'}
                    value={customExportSize}
                    onKeyDown={handleCustomSizeKeyDown}
                    onChange={(e) => handleCustomSizeChange(e.target.value)}
                  />
                }
              />
            </div>

            <div
              className="homepage-infoPanelContent__exportActions"
              data-slot="infoPanel-exportActions"
            >
              <Button
                type="button"
                variant="secondary"
                size="md"
                radius="md"
                disabled={isCopying}
                aria-busy={isCopying}
                aria-label={copyLabel}
                onClick={() => void handleCopy()}
              >
                {copyLabel}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                radius="md"
                disabled={isDownloading}
                aria-busy={isDownloading}
                aria-label={downloadLabel}
                onClick={() => void handleDownload()}
              >
                {downloadLabel}
              </Button>
              <div ref={settingsAnchorRef} className="homepage-infoPanel-settingsAnchor">
                {settingsPanelOpen ? (
                  <div className="homepage-infoPanel-settingsPop">
                    <BulkActionBarSettingsPanel
                      copyFormat={copyFormat}
                      downloadFormat={downloadFormat}
                      onCopyFormatChange={setCopyFormat}
                      onDownloadFormatChange={setDownloadFormat}
                    />
                  </div>
                ) : null}
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="md"
                  className="homepage-bulkAction-settingsBtn"
                  aria-label="Export format"
                  aria-haspopup="dialog"
                  aria-expanded={settingsPanelOpen}
                  onClick={() => setSettingsPanelOpen((o) => !o)}
                  leadingSlot={
                    <SomeIcon
                      iconName="interface-ellipsis-horizontal"
                      iconStyle="fill"
                      iconSize="sm"
                      padding="050"
                    />
                  }
                />
              </div>
            </div>

            <div className="homepage-infoPanelContent__snippetSection" data-slot="infoPanel-snippet-section">
              <p className="homepage-infoPanelContent__snippetHeading">React</p>
              <div
                className="homepage-infoPanelContent__snippetWrap"
                data-slot="infoPanel-snippet"
              >
                <div
                  className="homepage-infoPanelContent__snippetBlocks"
                  data-slot="infoPanel-snippet-blocks"
                >
                  <div
                    className="homepage-infoPanelContent__snippetBlock"
                    data-slot="infoPanel-snippet-import"
                  >
                    <div className="homepage-infoPanelContent__snippetBlockHead">
                      <span className="homepage-infoPanelContent__snippetBlockLabel">
                        Import
                      </span>
                      <Button
                        type="button"
                        variant="transparent"
                        size="sm"
                        radius="md"
                        className="homepage-infoPanelContent__snippetBlockCopy"
                        contentColor="var(--color-main-tertiary)"
                        aria-label={
                          snippetCopied === 'import'
                            ? 'Copied import'
                            : 'Copy import'
                        }
                        stateIcons={BULK_COPY_STATE_ICONS}
                        stripActiveIndex={snippetCopied === 'import' ? 1 : 0}
                        stripActiveBackground="var(--color-overlay-success)"
                        stripIconSize="xs"
                        onClick={() =>
                          void handleCopySnippetSection(
                            reactSnippetParts.importCode,
                            'import',
                          )
                        }
                        data-slot="infoPanel-snippet-copy-import"
                      />
                    </div>
                    <ReactSnippetLazy
                      code={reactSnippetParts.importCode}
                      className="homepage-infoPanelContent__snippetPlaceholder homepage-infoPanelContent__snippetPlaceholder--block"
                    />
                  </div>
                  <div
                    className="homepage-infoPanelContent__snippetBlock"
                    data-slot="infoPanel-snippet-usage"
                  >
                    <div className="homepage-infoPanelContent__snippetBlockHead">
                      <span className="homepage-infoPanelContent__snippetBlockLabel">
                        Usage
                      </span>
                      <Button
                        type="button"
                        variant="transparent"
                        size="sm"
                        radius="md"
                        className="homepage-infoPanelContent__snippetBlockCopy"
                        contentColor="var(--color-main-tertiary)"
                        aria-label={
                          snippetCopied === 'usage'
                            ? 'Copied usage'
                            : 'Copy usage'
                        }
                        stateIcons={BULK_COPY_STATE_ICONS}
                        stripActiveIndex={snippetCopied === 'usage' ? 1 : 0}
                        stripActiveBackground="var(--color-overlay-success)"
                        stripIconSize="xs"
                        onClick={() =>
                          void handleCopySnippetSection(
                            reactSnippetParts.usageCode,
                            'usage',
                          )
                        }
                        data-slot="infoPanel-snippet-copy-usage"
                      />
                    </div>
                    <ReactSnippetLazy
                      code={reactSnippetParts.usageCode}
                      className="homepage-infoPanelContent__snippetPlaceholder homepage-infoPanelContent__snippetPlaceholder--block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  )
}
