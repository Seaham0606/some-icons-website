import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/layout/Sidebar'
import { MainContent, ScrollArea } from '@/components/layout/MainContent'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { Footer } from '@/components/layout/Footer'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SearchInput } from '@/components/controls/SearchInput'
import { StyleToggle } from '@/components/controls/StyleToggle'
import { CategorySelect } from '@/components/controls/CategorySelect'
import { ColorPicker } from '@/components/controls/ColorPicker'
import { SizeSelector } from '@/components/controls/SizeSelector'
import { FormatSelector } from '@/components/controls/FormatSelector'
import { ExportButton } from '@/components/controls/ExportButton'
import { SegmentedButton } from '@/components/ui/segmented-control'
import { IconGrid } from '@/components/icons/IconGrid'
<<<<<<< Updated upstream
import { useChangelog, getLatestVersion } from '@/hooks/useChangelog'
import { useIcons } from '@/hooks/useIcons'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useMemo } from 'react'
import type { Icon } from '@/types/icon'
import { Link } from 'react-router-dom'
=======
import { HomePageFilterStack } from '@/components/home/HomePageFilters'
import { BulkColorPickerPanel } from '@/components/home/BulkColorPickerPanel'
import { PageContent } from '@/components/layout'
import { DEFAULT_ICON_SIZE } from '@/lib/constants'
import { useExportStore } from '@/stores/exportStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useUIStore } from '@/stores/uiStore'
import {
  BulkActionBar,
  BulkActionBarSettingsPanel,
  Button,
  type ButtonStateIcon,
  Chip,
  cn,
  Input,
  InputField,
  Sidebar,
  SiteFooter,
  SiteHeader,
  SomeIcon,
} from 'design-system'
import { ThemeButton } from '@/components/ThemeButton'
import { useColorStore } from '@/stores/colorStore'
import { useBackdropPresence } from '@/hooks/useBackdropPresence'
import { useBulkActionStripFeedback } from '@/hooks/useBulkActionStripFeedback'
import { useFilteredGridIcons } from '@/hooks/useFilteredGridIcons'
import { useIconExport } from '@/hooks/useIconExport'
import {
  getCodeCopyCtaLabel,
  getCodeCopySuccessLabel,
  getDefaultCodeFramework,
} from '@/lib/code-export'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
>>>>>>> Stashed changes

function normalizeQuery(s: string): string {
  return s.trim().toLowerCase()
}

function matches(icon: Icon, query: string): boolean {
  const q = normalizeQuery(query)
  if (!q) return true

  const searchableText = [
    icon.id,
    icon.category,
    ...(icon.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()

  return q.split(/\s+/).every((term) => searchableText.includes(term))
}

function getDerivedSortKey(iconId: string): string {
  const parts = iconId.split('-')
  if (parts.length > 1) {
    return parts.slice(1).join('-')
  }
  return iconId
}

export default function HomePage() {
  const { data: entries } = useChangelog()
<<<<<<< Updated upstream
  const version = getLatestVersion(entries)
  const { data: icons } = useIcons()
  const count = useSelectionStore((state) => state.count)
  const selectAll = useSelectionStore((state) => state.selectAll)
  const clear = useSelectionStore((state) => state.clear)
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const category = useFilterStore((state) => state.category)
  const style = useFilterStore((state) => state.style)
=======
  const version = getHighestVersion(entries)
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false)
  const [headerSettingsRowOpen, setHeaderSettingsRowOpen] = useState(false)
  const [mobileSearchOverlayOpen, setMobileSearchOverlayOpen] = useState(false)
  const [bulkBarSettingsOpen, setBulkBarSettingsOpen] = useState(false)
  const bulkBarSettingsAnchorRef = useRef<HTMLDivElement>(null)
  const [bulkColorPickerOpen, setBulkColorPickerOpen] = useState(false)
  const bulkColorPickerAnchorRef = useRef<HTMLDivElement>(null)
  const selectedColor = useColorStore((s) => s.selectedColor)
  const setSelectedColor = useColorStore((s) => s.setColor)
  const filtersBackdrop = useBackdropPresence(filtersSheetOpen)
  const exportSize = useExportStore((s) => s.size)
  const setExportSize = useExportStore((s) => s.setSize)
  const copyFormat = useExportStore((s) => s.copyFormat)
  const downloadFormat = useExportStore((s) => s.downloadFormat)
  const setCopyFormat = useExportStore((s) => s.setCopyFormat)
  const setDownloadFormat = useExportStore((s) => s.setDownloadFormat)
  const showExportValidation = useExportStore((s) => s.showValidationErrors)
  const downloadAssetLabel = useMemo(
    () =>
      EXPORT_FORMAT_OPTIONS.find((o) => o.value === downloadFormat)?.label ??
      downloadFormat.toUpperCase(),
    [downloadFormat],
  )
  const copyAssetLabel =
    copyFormat === 'code'
      ? 'React'
      : EXPORT_FORMAT_OPTIONS.find((o) => o.value === 'svg')?.label ?? 'SVG'
  const validateExport = useExportStore((s) => s.validate)
  const [customExportSize, setCustomExportSize] = useState('')
>>>>>>> Stashed changes

  // Get filtered icons for select all functionality
  const filteredIcons = useMemo(() => {
    if (!icons) return []

    let result = icons

    if (category !== 'all') {
      result = result.filter((icon) => icon.category === category)
    }

    if (searchQuery) {
      result = result.filter((icon) => matches(icon, searchQuery))
    }

    result = result.filter((icon) => icon.files[style])

    if (category === 'all') {
      result = [...result].sort((a, b) =>
        getDerivedSortKey(a.id).localeCompare(getDerivedSortKey(b.id))
      )
    } else {
      result = [...result].sort((a, b) => a.id.localeCompare(b.id))
    }

    return result
  }, [icons, searchQuery, category, style])

<<<<<<< Updated upstream
  const handleSelectAll = () => {
    const iconIds = filteredIcons.map((icon) => icon.id)
    selectAll(iconIds)
=======
  const scrollLocked = filtersSheetOpen || filtersBackdrop.mounted

  useEffect(() => {
    if (!scrollLocked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [scrollLocked])


  useEffect(() => {
    if (!bulkBarSettingsOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setBulkBarSettingsOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target instanceof Node ? e.target : null
      if (!node) return
      if (bulkBarSettingsAnchorRef.current?.contains(node)) return
      setBulkBarSettingsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [bulkBarSettingsOpen])

  useEffect(() => {
    if (!bulkColorPickerOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setBulkColorPickerOpen(false)
    }
    const onPointerDown = (e: PointerEvent) => {
      const node = e.target instanceof Node ? e.target : null
      if (!node) return
      if (bulkColorPickerAnchorRef.current?.contains(node)) return
      setBulkColorPickerOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [bulkColorPickerOpen])

  /** Below laptop, expanded search row and settings row share one strip — only one open at a time. */
  const toggleMobileHeaderSearch = useCallback(() => {
    setMobileSearchOverlayOpen((open) => {
      const next = !open
      if (next) setHeaderSettingsRowOpen(false)
      return next
    })
  }, [])

  const toggleMobileHeaderSettingsRow = useCallback(() => {
    setHeaderSettingsRowOpen((open) => {
      const next = !open
      if (next) setMobileSearchOverlayOpen(false)
      return next
    })
  }, [])

  const handleCustomExportSizeKeyDown = useCallback(
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
      if (next < 8) {
        handleCustomExportSizeChange('')
        return
      }
      handleCustomExportSizeChange(String(next))
    },
    [exportSize, handleCustomExportSizeChange],
  )

  const adjustBulkExportSize = useCallback(
    (delta: number) => {
      const fromField =
        customExportSize !== ''
          ? customExportSize
          : exportSize != null && exportSize > 0
            ? String(exportSize)
            : String(DEFAULT_ICON_SIZE)
      const digits = fromField.replace(/\D/g, '')
      const parsed = parseInt(digits, 10)
      const base =
        digits !== '' && !isNaN(parsed) && parsed > 0
          ? parsed
          : DEFAULT_ICON_SIZE
      const next = base + delta
      if (next < 8) {
        handleCustomExportSizeChange('')
        return
      }
      handleCustomExportSizeChange(String(next))
    },
    [customExportSize, exportSize, handleCustomExportSizeChange],
  )

  const bulkBarSizeInputValue =
    customExportSize !== ''
      ? customExportSize
      : exportSize != null
        ? String(exportSize)
        : ''

  const versionChip = (
    <Chip variant="accent" aria-label="Version 1.0.0">
      v1.0.0
    </Chip>
  )

  const logoImg = (
    <img
      src={logoSymbol}
      alt="Some Icons"
      width={28}
      height={28}
      className="ds-sidebar__logoIcon"
    />
  )

  const filterStackProps = {
    searchQuery,
    onSearchChange: setSearchQuery,
    iconStyle,
    onIconStyleChange: setIconStyle,
>>>>>>> Stashed changes
  }

  const handleDeselect = () => {
    clear()
  }

  return (
    <div className="flex flex-col h-dvh md:flex-row">
      {/* Mobile header with hamburger menu */}
      <MobileHeader />

      <Sidebar>
        {/* Logo section - centered like vanilla */}
        <SidebarHeader className="flex justify-center">
          <img
            src="/logo.svg"
            alt="Some Icons"
            className="h-6 w-auto"
          />
        </SidebarHeader>

        <SidebarContent className="space-y-6">
          {/* Search */}
          <div>
            <SearchInput />
          </div>

          {/* Style control */}
          <div>
            <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
              Style
            </label>
            <StyleToggle />
          </div>

          {/* Category control */}
          <div>
            <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
              Category
            </label>
            <CategorySelect />
          </div>

          {/* Customize section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-[var(--color-text-secondary)] pt-2 mb-4">
              Customize
            </h3>
            <div>
              <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
                Color
              </label>
              <ColorPicker />
            </div>
          </div>

          {/* Download section */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-[var(--color-text-secondary)] pt-2 mb-4">
              Download
            </h3>
            <div>
              <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
                Size
              </label>
              <SizeSelector />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--item-tertiary)] pl-0.5 mb-2 block">
                Format
              </label>
              <FormatSelector />
            </div>
            <div className="space-y-2">
              <ExportButton />
              {count > 0 && (
                <div className="flex gap-2 items-center mt-0">
                  <SegmentedButton
                    onClick={handleSelectAll}
                    isActive={false}
                    variant="secondary"
                    tint="blue"
                    textString="Select all"
                    className="text-base font-semibold !rounded-[10px]"
                  />
                  <SegmentedButton
                    onClick={handleDeselect}
                    isActive={false}
                    variant="secondary"
                    tint="red"
                    textString="Deselect"
                    className="text-base font-semibold !rounded-[10px]"
                  />
                </div>
              )}
            </div>
          </div>
        </SidebarContent>

        {/* Footer with theme toggle and version */}
        <SidebarFooter>
          <ThemeToggle />
          {version && (
            <Link
              to="/changelog"
              className="text-[var(--foreground-quaternary)] hover:text-foreground transition-colors"
            >
              v{version}
            </Link>
          )}
        </SidebarFooter>
      </Sidebar>

<<<<<<< Updated upstream
      <MainContent>
        <ScrollArea>
          <IconGrid />
        </ScrollArea>
        <Footer />
      </MainContent>
=======
      <main className="homepage-main">
        <div className="homepage-pageContentWrap">
          <PageContent>
            <IconGrid
              gradientOverlayInsetPx={
                selectionCount > 0 ? GRADIENT_OVERLAY_HOME_HEIGHT_PX : 0
              }
            />
            <SiteFooter
              className="ds-siteFooter--inScroll homepage-mobile-only"
              copyright={copyrightNode}
            />
          </PageContent>
          <GradientOverlay
            visible={selectionCount > 0}
            fullWidth
            className="homepage-bulkOverlay"
            style={{ height: GRADIENT_OVERLAY_HOME_HEIGHT_PX }}
            progressiveBlur
            progressiveBlurIntensity={80}
            progressiveBlurPosition="bottom"
            backdropBlur={false}
          >
            {selectionCount > 0 ? (
            <div className="homepage-bulkBarsWrap">
              <BulkActionBar
                selectedCount={selectionCount}
                summaryTrailingSlot={
                  <BulkActionHoverChip
                    chipLabel={allVisibleSelected ? 'Deselect all' : 'Select all'}
                  >
                    <Button
                      type="button"
                      variant="transparent"
                      size="md"
                      radius="md"
                      disabled={visibleGridIcons.length === 0}
                      aria-label={
                        allVisibleSelected ? 'Deselect all' : 'Select all'
                      }
                      aria-pressed={allVisibleSelected}
                      onClick={handleToggleSelectAllVisible}
                      leadingSlot={
                        <SomeIcon
                          iconName="symbol-check-multiple"
                          iconStyle="outline"
                          iconSize="md"
                          padding="0"
                        />
                      }
                    />
                  </BulkActionHoverChip>
                }
              >
                <>
                  <div className="ds-segmentedControl__dividerWrap" aria-hidden>
                    <div className="ds-segmentedControl__divider" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      ref={bulkColorPickerAnchorRef}
                      className="homepage-bulkColorPickerAnchor"
                    >
                      {bulkColorPickerOpen ? (
                        <div className="homepage-bulkColorPickerPop">
                          <BulkColorPickerPanel
                            color={selectedColor}
                            onColorChange={setSelectedColor}
                          />
                        </div>
                      ) : null}
                      <BulkActionHoverChip chipLabel="Icon color">
                        <Button
                          type="button"
                          variant="transparent"
                          size="md"
                          radius="md"
                          className="homepage-bulkAction-colorBtn"
                          aria-label="Icon color"
                          aria-haspopup="dialog"
                          aria-expanded={bulkColorPickerOpen}
                          data-color-active={selectedColor != null ? 'true' : undefined}
                          onClick={() => setBulkColorPickerOpen((o) => !o)}
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
                      </BulkActionHoverChip>
                    </div>
                    <BulkActionHoverChip chipLabel="Icon size">
                      <Input
                        className="homepage-bulkBar-sizeInput"
                        aria-label="Icon size in pixels"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        status={sizeFieldError ? 'error' : 'default'}
                        value={bulkBarSizeInputValue}
                        onKeyDown={handleCustomExportSizeKeyDown}
                        onChange={(e) =>
                          handleCustomExportSizeChange(e.target.value)
                        }
                        leadingSlot={
                          <button
                            type="button"
                            className="homepage-bulkBar-sizeStep"
                            aria-label="Decrease icon size"
                            disabled={parseInt(bulkBarSizeInputValue, 10) <= 8}
                            onClick={() => adjustBulkExportSize(-1)}
                          >
                            <SomeIcon
                              iconName="symbol-minus"
                              iconStyle="outline"
                              iconSize="sm"
                              padding="050"
                              color="currentColor"
                            />
                          </button>
                        }
                        trailingSlot={
                          <button
                            type="button"
                            className="homepage-bulkBar-sizeStep"
                            aria-label="Increase icon size"
                            onClick={() => adjustBulkExportSize(1)}
                          >
                            <SomeIcon
                              iconName="symbol-plus"
                              iconStyle="outline"
                              iconSize="sm"
                              padding="050"
                              color="currentColor"
                            />
                          </button>
                        }
                      />
                    </BulkActionHoverChip>
                  </div>
                  <div className="ds-segmentedControl__dividerWrap" aria-hidden>
                    <div className="ds-segmentedControl__divider" />
                  </div>
                  <div className="ds-buttonGroup">
                    {showCopyAction ? (
                      <BulkActionHoverChip
                        chipLabel={
                          copySuccessStrip
                            ? bulkCopySuccessLabel
                            : bulkCopyIdleLabel
                        }
                      >
                        <Button
                          type="button"
                          variant="transparent"
                          size="md"
                          radius="md"
                          disabled={isCopying}
                          aria-busy={isCopying}
                          onClick={() => void onBulkCopy()}
                          aria-label={
                            copySuccessStrip
                              ? bulkCopySuccessLabel
                              : bulkCopyIdleLabel
                          }
                          stateIcons={BULK_COPY_STATE_ICONS}
                          stripActiveIndex={copySuccessStrip ? 1 : 0}
                          stripActiveBackground="var(--color-overlay-success)"
                        />
                      </BulkActionHoverChip>
                    ) : null}
                    {showDownloadAction ? (
                      <BulkActionHoverChip
                        chipLabel={
                          downloadSuccessStrip
                            ? `Downloaded ${downloadAssetLabel}`
                            : `Download ${downloadAssetLabel}`
                        }
                      >
                        <Button
                          type="button"
                          variant="transparent"
                          size="md"
                          radius="md"
                          disabled={isDownloading}
                          aria-busy={isDownloading}
                          onClick={() => void onBulkDownload()}
                          aria-label={
                            downloadSuccessStrip
                              ? `Downloaded ${downloadAssetLabel}`
                              : `Download ${downloadAssetLabel}`
                          }
                          stateIcons={BULK_DOWNLOAD_STATE_ICONS}
                          stripActiveIndex={downloadSuccessStrip ? 1 : 0}
                          stripActiveBackground="var(--color-overlay-success)"
                        />
                      </BulkActionHoverChip>
                    ) : null}
                    <div
                      ref={bulkBarSettingsAnchorRef}
                      className="homepage-bulkBarSettingsAnchor"
                    >
                      {bulkBarSettingsOpen ? (
                        <div className="homepage-bulkBarSettingsPop">
                          <BulkActionBarSettingsPanel
                            copyFormat={copyFormat}
                            downloadFormat={downloadFormat}
                            onCopyFormatChange={setCopyFormat}
                            onDownloadFormatChange={setDownloadFormat}
                            disableCopySvg={selectionCount > 1}
                          />
                        </div>
                      ) : null}
                      <BulkActionHoverChip chipLabel="More options">
                        <Button
                          type="button"
                          variant="transparent"
                          size="md"
                          radius="md"
                          className="homepage-bulkAction-settingsBtn"
                          aria-label="Export format"
                          aria-haspopup="dialog"
                          aria-expanded={bulkBarSettingsOpen}
                          onClick={() =>
                            setBulkBarSettingsOpen((open) => !open)
                          }
                          leadingSlot={
                            <SomeIcon
                              iconName="interface-ellipsis-horizontal"
                              iconStyle="fill"
                              iconSize="sm"
                              padding="050"
                            />
                          }
                        />
                      </BulkActionHoverChip>
                    </div>
                  </div>
                </>
              </BulkActionBar>
              <div className="homepage-bulkBarAside">
                <BulkActionHoverChip chipLabel="Clear">
                  <Button
                    type="button"
                    variant="transparent"
                    size="md"
                    radius="md"
                    className="ds-bulkActionBar__dismiss"
                    aria-label="Clear"
                    onClick={() => clearSelection()}
                    leadingSlot={
                      <SomeIcon
                        iconName="symbol-multiply"
                        iconStyle="outline"
                        iconSize="md"
                        padding="0"
                      />
                    }
                  />
                </BulkActionHoverChip>
              </div>
            </div>
            ) : null}
          </GradientOverlay>
        </div>
      </main>

      <SiteFooter
        className="ds-siteFooter--fixed homepage-tablet-only"
        copyright={copyrightNode}
      />
>>>>>>> Stashed changes
    </div>
  )
}
