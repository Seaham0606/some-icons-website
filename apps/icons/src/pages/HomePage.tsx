import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import {
  GradientOverlay,
  GRADIENT_OVERLAY_HOME_HEIGHT_PX,
} from '@/components/overlay/GradientOverlay'
import { IconGrid } from '@/components/icons/IconGrid'
import { HomePageFilterStack } from '@/components/home/HomePageFilters'
import { PageContent } from '@/components/layout'
import { SIZE_PRESETS } from '@/lib/constants'
import { MEDIA_QUERIES } from '@/lib/breakpoints'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useUIStore } from '@/stores/uiStore'
import {
  BulkActionBar,
  Button,
  type ButtonStateIcon,
  Chip,
  Sidebar,
  SiteFooter,
  SiteHeader,
  SomeIcon,
} from 'design-system'
import { ThemeButton } from '@/components/ThemeButton'
import { useBulkActionStripFeedback } from '@/hooks/useBulkActionStripFeedback'
import { useFilteredGridIcons } from '@/hooks/useFilteredGridIcons'
import { useIconExport } from '@/hooks/useIconExport'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'
import {
  useCallback,
  useEffect,
  useMemo,
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

/** Strips a conventional semver `v` prefix for accessible version phrases (display is customized via `Chip`). */
function stripLeadingV(version: string): string {
  return version.trim().replace(/^v(?=\d)/i, '')
}

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
  const selectedColor = useColorStore((s) => s.selectedColor)
  const setIconColor = useColorStore((s) => s.setColor)
  const { data: entries } = useChangelog()
  const version = getHighestVersion(entries)
  const [settingsSectionExpanded, setSettingsSectionExpanded] = useState(true)
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false)
  const [mobileSearchOverlayOpen, setMobileSearchOverlayOpen] = useState(false)
  const exportSize = useExportStore((s) => s.size)
  const gridPreviewPx = useExportStore((s) => s.gridPreviewPx)
  const setExportSize = useExportStore((s) => s.setSize)
  const exportFormat = useExportStore((s) => s.format)
  const setExportFormat = useExportStore((s) => s.setFormat)
  const showExportValidation = useExportStore((s) => s.showValidationErrors)
  const exportFormatLabel = useMemo(() => {
    if (exportFormat == null) return 'SVG'
    return (
      EXPORT_FORMAT_OPTIONS.find((o) => o.value === exportFormat)?.label ??
      exportFormat.toUpperCase()
    )
  }, [exportFormat])
  const validateExport = useExportStore((s) => s.validate)
  const [customExportSize, setCustomExportSize] = useState('')
  const [customExportSizeFocused, setCustomExportSizeFocused] = useState(false)

  const sizePresetValue = useMemo((): (typeof SIZE_PRESETS)[number] | null => {
    if (gridPreviewPx === null) return null
    if (exportSize == null) return null
    return (SIZE_PRESETS as readonly number[]).includes(exportSize)
      ? (exportSize as (typeof SIZE_PRESETS)[number])
      : null
  }, [exportSize, gridPreviewPx])

  const { sizeValid, formatValid } = validateExport()
  const sizeFieldError = showExportValidation && !sizeValid
  const formatFieldError = showExportValidation && !formatValid
  const isExportSizeRowExpanded =
    customExportSize.length > 0 || customExportSizeFocused

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

  const showCopyAction = exportFormat !== 'png'
  const showDownloadAction = exportFormat !== 'code'
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

  const handleExportPresetSize = useCallback(
    (preset: (typeof SIZE_PRESETS)[number]) => {
      setExportSize(preset)
      setCustomExportSize('')
    },
    [setExportSize],
  )

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

  useEffect(() => {
    if (!filtersSheetOpen && !mobileSearchOverlayOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [filtersSheetOpen, mobileSearchOverlayOpen])

  const openChromeSettings = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia(MEDIA_QUERIES.laptopAndUp).matches
    ) {
      setSettingsSectionExpanded(true)
    } else {
      setFiltersSheetOpen(true)
    }
  }, [setSettingsSectionExpanded, setFiltersSheetOpen])

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
      if (next < 1) {
        handleCustomExportSizeChange('')
        return
      }
      handleCustomExportSizeChange(String(next))
    },
    [exportSize, handleCustomExportSizeChange],
  )

  const versionChip =
    version ? (
      <Chip variant="accent" aria-label={`Beta, version ${stripLeadingV(version)}`}>
        Beta
      </Chip>
    ) : null

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
    settingsSectionExpanded,
    onSettingsSectionExpandedChange: setSettingsSectionExpanded,
    selectedColor,
    onColorChange: setIconColor,
    sizePresetValue,
    onExportPresetSize: handleExportPresetSize,
    customExportSize,
    onCustomExportSizeFocus: () => setCustomExportSizeFocused(true),
    onCustomExportSizeBlur: () => setCustomExportSizeFocused(false),
    onCustomExportSizeChange: handleCustomExportSizeChange,
    onCustomExportSizeKeyDown: handleCustomExportSizeKeyDown,
    exportFormat,
    onExportFormatChange: setExportFormat,
    sizeFieldError,
    formatFieldError,
    isExportSizeRowExpanded,
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
        settingsAriaLabel="Filters and settings"
        onSettingsClick={() => setFiltersSheetOpen(true)}
        mobileSearchOpen={mobileSearchOverlayOpen}
        onMobileSearchToggle={() => setMobileSearchOverlayOpen((o) => !o)}
      />

      {filtersSheetOpen ? (
        <>
          <button
            type="button"
            className="app-backdrop"
            aria-label="Dismiss filters"
            onClick={() => setFiltersSheetOpen(false)}
          />
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
        </>
      ) : null}

      {mobileSearchOverlayOpen ? (
        <>
          <button
            type="button"
            className="app-backdrop"
            aria-label="Dismiss search"
            onClick={() => setMobileSearchOverlayOpen(false)}
          />
        </>
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
                  {(showCopyAction || showDownloadAction) && (
                    <div className="ds-buttonGroup">
                      {showCopyAction ? (
                        <BulkActionHoverChip
                          chipLabel={
                            copySuccessStrip
                              ? `Copied ${exportFormatLabel}`
                              : `Copy ${exportFormatLabel}`
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
                                ? `Copied ${exportFormatLabel}`
                                : `Copy ${exportFormatLabel}`
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
                              ? `Downloaded ${exportFormatLabel}`
                              : `Download ${exportFormatLabel}`
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
                                ? `Downloaded ${exportFormatLabel}`
                                : `Download ${exportFormatLabel}`
                            }
                            stateIcons={BULK_DOWNLOAD_STATE_ICONS}
                            stripActiveIndex={downloadSuccessStrip ? 1 : 0}
                            stripActiveBackground="var(--color-overlay-success)"
                          />
                        </BulkActionHoverChip>
                      ) : null}
                    </div>
                  )}
                  {(showCopyAction || showDownloadAction) && (
                    <div className="ds-segmentedControl__dividerWrap" aria-hidden>
                      <div className="ds-segmentedControl__divider" />
                    </div>
                  )}
                  <BulkActionHoverChip chipLabel="More options">
                    <Button
                      type="button"
                      variant="transparent"
                      size="md"
                      radius="md"
                      className="homepage-bulkAction-settingsBtn"
                      aria-label="Settings"
                      onClick={openChromeSettings}
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
                        iconName="arrow-up-out-alt"
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
