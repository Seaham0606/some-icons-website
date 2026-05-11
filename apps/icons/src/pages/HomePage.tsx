import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import {
  GradientOverlay,
  GRADIENT_OVERLAY_HOME_HEIGHT_PX,
} from '@/components/overlay/GradientOverlay'
import { IconGrid } from '@/components/icons/IconGrid'
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
import { useChangelog } from '@/hooks/useChangelog'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

const BULK_COPY_STATE_ICONS = [
  { iconName: 'interface-copy', iconStyle: 'outline' },
  {
    iconName: 'symbol-check-mark',
    iconStyle: 'outline',
    color: 'var(--color-intent-success-strong)',
  },
] as const satisfies [ButtonStateIcon, ButtonStateIcon]

const BULK_DOWNLOAD_STATE_ICONS = [
  { iconName: 'arrow-down', iconStyle: 'outline' },
  {
    iconName: 'symbol-check-mark',
    iconStyle: 'outline',
    color: 'var(--color-intent-success)',
  },
] as const satisfies [ButtonStateIcon, ButtonStateIcon]


/** Inverse chip on hover/focus — below the control (IconCard filename pattern). */
function BulkActionHoverChip({
  chipLabel,
  children,
}: {
  chipLabel: string
  children: ReactNode
}) {
  return (
    <div className="homepage-bulkAction-hoverWrap">
      {children}
      <div className="homepage-bulkAction-hoverMeta" aria-hidden>
        <Chip variant="inverse" backdropBlur>
          {chipLabel}
        </Chip>
      </div>
    </div>
  )
}

function HomeThemeButton() {
  const setTheme = useUIStore((s) => s.setTheme)
  const mode = useUIStore((s) => s.getEffectiveTheme())
  return (
    <ThemeButton
      mode={mode}
      onToggle={() =>
        setTheme(useUIStore.getState().getEffectiveTheme() === 'dark' ? 'light' : 'dark')
      }
    />
  )
}

const EXPORT_FORMAT_OPTIONS = [
  { value: 'svg' as const, label: 'SVG' },
  { value: 'png' as const, label: 'PNG' },
  { value: 'code' as const, label: 'Code' },
]

export default function HomePage() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const iconStyle = useFilterStore((s) => s.style)
  const setIconStyle = useFilterStore((s) => s.setStyle)
  useChangelog()
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

  const { sizeValid } = validateExport()
  const sizeFieldError = showExportValidation && !sizeValid

  const {
    handleCopy,
    handleDownload,
    isCopying,
    isDownloading,
    selectionCount,
  } = useIconExport()
  const clearSelection = useSelectionStore((s) => s.clear)

  const {
    copySuccessStrip,
    downloadSuccessStrip,
    flashCopySuccess,
    flashDownloadSuccess,
  } = useBulkActionStripFeedback()

  const onBulkCopy = useCallback(async () => {
    const ok = await handleCopy()
    if (ok) flashCopySuccess()
  }, [handleCopy, flashCopySuccess])

  const onBulkDownload = useCallback(async () => {
    const ok = await handleDownload()
    if (ok) {
      flashDownloadSuccess(() => {
        clearSelection()
      })
    }
  }, [clearSelection, flashDownloadSuccess, handleDownload])

  const showCopyAction =
    copyFormat === 'code' || selectionCount <= 1
  const showDownloadAction = true

  const bulkCopyIdleLabel =
    copyFormat === 'code'
      ? getCodeCopyCtaLabel(getDefaultCodeFramework())
      : `Copy ${copyAssetLabel}`
  const bulkCopySuccessLabel =
    copyFormat === 'code'
      ? getCodeCopySuccessLabel(getDefaultCodeFramework())
      : `Copied ${copyAssetLabel}`
  const visibleGridIcons = useFilteredGridIcons()
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const selectAllVisible = useSelectionStore((s) => s.selectAll)
  const deselectMany = useSelectionStore((s) => s.deselectMany)

  const visibleIds = useMemo(
    () => visibleGridIcons.map((icon) => icon.id),
    [visibleGridIcons],
  )

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))

  const handleToggleSelectAllVisible = useCallback(() => {
    if (visibleIds.length === 0) return
    if (allVisibleSelected) {
      deselectMany(visibleIds)
    } else {
      selectAllVisible(visibleIds)
    }
  }, [allVisibleSelected, deselectMany, selectAllVisible, visibleIds])

  const handleCustomExportSizeChange = useCallback(
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
  }

  const copyrightNode = <>© {new Date().getFullYear()} Some UI</>

  return (
    <div className="homepage-shell">
      <div className="homepage-laptop-only">
        <Sidebar
          pageName="Icon library"
          chipSlot={versionChip}
          logo={logoImg}
          themeButton={<HomeThemeButton />}
          socialButtons={
            <div className="ds-sidebar__social">
              <a
                href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
                target="_blank"
                rel="noreferrer"
                className="ds-sidebar__socialLink"
                aria-label="Figma community plugin"
              >
                <img
                  src={figmaIcon}
                  alt="Figma"
                  className="ds-sidebar__socialIconImg"
                />
              </a>
              <a
                href="https://github.com/Seaham0606/some-icons-cdn"
                target="_blank"
                rel="noreferrer"
                className="ds-sidebar__socialLink"
                aria-label="GitHub repository"
              >
                <span
                  aria-hidden="true"
                  className="ds-sidebar__socialIconMask"
                  style={{
                    backgroundColor: 'var(--color-main-primary)',
                    WebkitMaskImage: `url("${githubIcon}")`,
                    maskImage: `url("${githubIcon}")`,
                    maskMode: 'alpha',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
              </a>
            </div>
          }
        >
          <HomePageFilterStack {...filterStackProps} showSearch />
        </Sidebar>
      </div>

      <SiteHeader
        className="app-hide-from-laptop"
        logo={logoImg}
        title="Icon library"
        chipSlot={versionChip}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search icons..."
        searchAriaLabel="Search icons"
        mobileSearchOpen={mobileSearchOverlayOpen}
        settingsRowOpen={headerSettingsRowOpen}
        rightSlot={({ mobileSearchPanelId, settingsRowPanelId }) => (
          <>
            <div className="ds-siteHeader__tabletSearch ds-siteHeader-tabletOnly">
              <InputField
                showLabel={false}
                className="ds-siteHeader__searchField"
                contentSlot={
                  <Input
                    type="text"
                    placeholder="Search icons..."
                    autoComplete="off"
                    aria-label="Search icons"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leadingSlot={
                      <SomeIcon
                        iconName="interface-search"
                        iconStyle="outline"
                        iconSize="md"
                        padding="2"
                      />
                    }
                  />
                }
              />
            </div>
            <div className="ds-siteHeader__actions">
              <div className="ds-buttonGroup ds-siteHeader-mobileOnly">
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="lg"
                  aria-label="Search icons"
                  aria-expanded={mobileSearchOverlayOpen}
                  aria-controls={mobileSearchPanelId}
                  onClick={toggleMobileHeaderSearch}
                  leadingSlot={
                    <SomeIcon
                      iconName="interface-search"
                      iconStyle="outline"
                      iconSize="md"
                      padding="050"
                    />
                  }
                />
              </div>
              <Button
                type="button"
                variant="transparent"
                size="md"
                radius="lg"
                aria-label="Settings"
                aria-expanded={headerSettingsRowOpen}
                aria-controls={settingsRowPanelId}
                onClick={toggleMobileHeaderSettingsRow}
                leadingSlot={
                  <SomeIcon
                    iconName="interface-menu-hamburger"
                    iconStyle="outline"
                    iconSize="md"
                    padding="050"
                  />
                }
              />
            </div>
          </>
        )}
      />

      {filtersBackdrop.mounted ? (
        <button
          type="button"
          className={cn(
            'app-backdrop',
            filtersBackdrop.visible && 'app-backdrop--visible',
          )}
          aria-label="Dismiss filters"
          onClick={() => setFiltersSheetOpen(false)}
        />
      ) : null}

      {filtersSheetOpen ? (
        <div
          className="app-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Filters and settings"
        >
          <div className="app-sheet__header">
            <span className="app-sheet__title text-aside-header">
              Filters
            </span>
            <Button
              type="button"
              variant="transparent"
              size="md"
              radius="md"
              onClick={() => setFiltersSheetOpen(false)}
            >
              Done
            </Button>
          </div>
          <div className="app-sheet__body">
            <div className="app-sheet__themeRow">
              <HomeThemeButton />
            </div>
            <HomePageFilterStack
              {...filterStackProps}
              showSearch={false}
              categoryListClassName="homepage-categoryList homepage-categoryList--sheet"
              categorySectionClassName="homepage-sidebarCategorySection homepage-sidebarCategorySection--sheet"
            />
          </div>
        </div>
      ) : null}

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
    </div>
  )
}
