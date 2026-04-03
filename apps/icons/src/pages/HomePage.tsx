import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import {
  GradientOverlay,
  GRADIENT_OVERLAY_HOME_HEIGHT_PX,
} from '@/components/overlay/GradientOverlay'
import { PageContent } from '@/components/layout/PageContent'
import { IconGrid } from '@/components/icons/IconGrid'
import { getCategoryIcon, getCategoryLabel } from '@/lib/category-icons'
import type { ExportFormat } from '@/lib/constants'
import { SIZE_PRESETS } from '@/lib/constants'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useUIStore } from '@/stores/uiStore'
import {
  BulkActionBar,
  Button,
  Chip,
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownMenuDivider,
  Input,
  InputField,
  InputSection,
  SegmentedControl,
  Sidebar,
  SomeIcon,
  ThemeButton,
  dropdownMenuOptionClassName,
} from 'design-system'
import { useFilteredGridIcons } from '@/hooks/useFilteredGridIcons'
import { useIconExport } from '@/hooks/useIconExport'
import { getCategories, useIcons } from '@/hooks/useIcons'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'
import type { IconStyle } from '@/types/icon'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

/** Strips a conventional semver `v` prefix for accessible version phrases (display is customized via `Chip`). */
function stripLeadingV(version: string): string {
  return version.trim().replace(/^v(?=\d)/i, '')
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

interface HomeCategoryDropdownMenuProps {
  onSelect: (category: string) => void
  onClose?: () => void
  className?: string
}

function HomeCategoryDropdownMenu({
  onSelect,
  onClose,
  className,
}: HomeCategoryDropdownMenuProps) {
  const { data: icons } = useIcons()
  const categories = getCategories(icons)
  const category = useFilterStore((s) => s.category)
  const [hasSelection, setHasSelection] = useState(false)
  const selectedRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const selected = selectedRowRef.current
    if (!selected) return
    const id = window.setTimeout(() => {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, 0)
    return () => window.clearTimeout(id)
  }, [category])

  const allCategories = ['all', ...categories]

  return (
    <DropdownMenu
      className={className}
      role="listbox"
      aria-label="Categories"
      onMouseLeave={() => {
        if (hasSelection && onClose) onClose()
      }}
    >
      {allCategories.map((cat, index) => (
        <Fragment key={cat}>
          <div ref={category === cat ? selectedRowRef : null}>
            <Button
              type="button"
              variant="transparent"
              tint="default"
              size="md"
              fullWidth
              aria-selected={category === cat}
              data-dropdown-selected={category === cat ? 'true' : 'false'}
              className={dropdownMenuOptionClassName}
              leadingSlot={
                <SomeIcon
                  iconName={getCategoryIcon(cat)}
                  iconStyle="outline"
                  iconSize="sm"
                  padding="050"
                />
              }
              onClick={() => {
                onSelect(cat)
                setHasSelection(true)
              }}
            >
              {getCategoryLabel(cat)}
            </Button>
          </div>
          {index === 0 ? <DropdownMenuDivider /> : null}
        </Fragment>
      ))}
    </DropdownMenu>
  )
}

const STYLE_SEGMENT_OPTIONS = [
  { value: 'outline' as const, label: 'Outline' },
  { value: 'filled' as const, label: 'Filled' },
] satisfies ReadonlyArray<{ value: IconStyle; label: string }>

const EXPORT_SIZE_OPTIONS = SIZE_PRESETS.map((size) => ({
  value: size,
  label: String(size),
}))

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
  const category = useFilterStore((s) => s.category)
  const setCategory = useFilterStore((s) => s.setCategory)
  const selectedColor = useColorStore((s) => s.selectedColor)
  const setIconColor = useColorStore((s) => s.setColor)
  const { data: entries } = useChangelog()
  const version = getHighestVersion(entries)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [settingsSectionExpanded, setSettingsSectionExpanded] = useState(true)
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
  const bulkSessionActive = useSelectionStore((s) => s.bulkSessionActive)

  const copyActionDisabled = exportFormat === 'png'
  const downloadActionDisabled = exportFormat === 'code'
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
      deselectMany(visibleIds, { keepBulkSessionWhenEmpty: true })
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

  return (
    <div className="homepage-shell">
      <Sidebar
        pageName="Icon library"
        chipSlot={
          version ? (
            <Chip variant="accent" aria-label={`Beta, version ${stripLeadingV(version)}`}>
              Beta
            </Chip>
          ) : null
        }
        logo={
          <img
            src={logoSymbol}
            alt="Some Icons"
            width={28}
            height={28}
            className="ds-sidebar__logoIcon"
          />
        }
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
        <InputSection
          showLabel={false}
          contentSlot={
            <>
              <InputField
                showLabel={false}
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
              <InputField
                label="Style"
                contentSlot={
                  <SegmentedControl<IconStyle>
                    options={STYLE_SEGMENT_OPTIONS}
                    value={iconStyle}
                    onChange={setIconStyle}
                  />
                }
              />
              <InputField
                className="homepage-category-field"
                label="Category"
                contentSlot={
                  <Dropdown
                    className="homepage-category-dropdown"
                    empty={false}
                    fullWidth
                    variant="overlay"
                    expanded={categoryDropdownOpen}
                    onOverlayDismiss={() => setCategoryDropdownOpen(false)}
                    onClick={() =>
                      setCategoryDropdownOpen((open) => !open)
                    }
                    panelSlot={
                      <HomeCategoryDropdownMenu
                        className="homepage-category-dropdown-panel"
                        onSelect={(c) => {
                          setCategory(c)
                          setCategoryDropdownOpen(false)
                        }}
                        onClose={() => setCategoryDropdownOpen(false)}
                      />
                    }
                    leadingSlot={
                      <SomeIcon
                        iconName={getCategoryIcon(category)}
                        iconStyle="outline"
                        iconSize="md"
                        padding="2"
                      />
                    }
                    trailingSlot={
                      <SomeIcon
                        iconName="arrow-down-triangle"
                        iconStyle="fill"
                        iconSize="md"
                        padding="2"
                        color="var(--color-main-tertiary)"
                      />
                    }
                  >
                    {getCategoryLabel(category)}
                  </Dropdown>
                }
              />
            </>
          }
        />
        <InputSection
          label="Settings"
          collapsible
          expanded={settingsSectionExpanded}
          onExpandedChange={(expanded) => {
            setSettingsSectionExpanded(expanded)
            if (expanded && categoryDropdownOpen) {
              setCategoryDropdownOpen(false)
            }
          }}
          leadingSlot={
            <SomeIcon
              iconName="interface-settings-nut"
              iconStyle="outline"
              iconSize="sm"
            />
          }
          leadingColor="var(--color-main-secondary)"
          contentSlot={
            <>
              <div className="homepage-export-metaFields">
                <ColorField
                  color={selectedColor}
                  onColorChange={setIconColor}
                />
                <div
                  className="homepage-export-sizeReveal"
                  data-expanded="true"
                >
                  <div className="homepage-export-sizeReveal__motion">
                    <InputField
                      className={
                        isExportSizeRowExpanded
                          ? 'homepage-size-export-field homepage-size-export-field--expanded'
                          : 'homepage-size-export-field'
                      }
                      label="Size"
                      showCol2
                      col2Width="size-12"
                      contentSlot={
                        <SegmentedControl<(typeof SIZE_PRESETS)[number]>
                          options={EXPORT_SIZE_OPTIONS}
                          value={sizePresetValue}
                          onChange={handleExportPresetSize}
                          hasError={sizeFieldError}
                        />
                      }
                      secondarySlot={
                        <Input
                          className="homepage-size-custom-input"
                          showLeading={false}
                          showTrailing={false}
                          value={customExportSize}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="off"
                          status={sizeFieldError ? 'error' : 'default'}
                          onFocus={() => setCustomExportSizeFocused(true)}
                          onBlur={() => setCustomExportSizeFocused(false)}
                          onKeyDown={handleCustomExportSizeKeyDown}
                          onChange={(e) =>
                            handleCustomExportSizeChange(e.target.value)
                          }
                        />
                      }
                    />
                  </div>
                </div>
                <InputField
                  label="Format"
                  contentSlot={
                    <SegmentedControl<ExportFormat>
                      options={EXPORT_FORMAT_OPTIONS}
                      value={exportFormat}
                      onChange={setExportFormat}
                      hasError={formatFieldError}
                    />
                  }
                />
              </div>
            </>
          }
        />
      </Sidebar>

      <main className="homepage-main">
        <div className="homepage-pageContentWrap">
          <PageContent>
            <IconGrid
              gradientOverlayInsetPx={
                bulkSessionActive ? GRADIENT_OVERLAY_HOME_HEIGHT_PX : 0
              }
            />
          </PageContent>
          <GradientOverlay
            visible={bulkSessionActive}
            fullWidth
            className="homepage-bulkOverlay"
            style={{ height: GRADIENT_OVERLAY_HOME_HEIGHT_PX }}
            progressiveBlur
            progressiveBlurIntensity={80}
            progressiveBlurPosition="bottom"
            backdropBlur={false}
          >
            <BulkActionBar
              selectedCount={selectionCount}
              sessionActive={bulkSessionActive}
              summaryTrailingSlot={
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="md"
                  disabled={visibleGridIcons.length === 0}
                  aria-label={
                    allVisibleSelected
                      ? 'Deselect visible icons'
                      : 'Select all icons'
                  }
                  title={
                    allVisibleSelected
                      ? 'Deselect visible icons'
                      : 'Select all icons'
                  }
                  aria-pressed={allVisibleSelected}
                  onClick={handleToggleSelectAllVisible}
                  leadingSlot={
                    <SomeIcon
                      iconName="symbol-check-multiple"
                      iconStyle="outline"
                      iconSize="sm"
                      padding="050"
                    />
                  }
                />
              }
            >
              <>
                <div className="ds-buttonGroup">
                  <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="md"
                  disabled={copyActionDisabled || isCopying}
                  aria-busy={isCopying}
                  title={
                    copyActionDisabled
                      ? 'Copy is only available for SVG and Code formats'
                      : `Copy selected icons as ${exportFormatLabel}`
                  }
                  onClick={() => void handleCopy()}
                  aria-label={
                    copyActionDisabled
                      ? 'Copy is only available for SVG and Code formats'
                      : `Copy selected icons as ${exportFormatLabel}`
                  }
                  leadingSlot={
                    isCopying ? (
                      <SomeIcon
                        iconName="interface-loading"
                        iconStyle="outline"
                        iconSize="sm"
                        padding="050"
                        className="animate-spin"
                      />
                    ) : (
                      <SomeIcon
                        iconName="interface-copy"
                        iconStyle="outline"
                        iconSize="sm"
                        padding="050"
                      />
                    )
                  }
                />
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="md"
                  disabled={downloadActionDisabled || isDownloading}
                  aria-busy={isDownloading}
                  title={
                    downloadActionDisabled
                      ? 'Download is not available for Code; use Copy'
                      : `Download selected icons as ${exportFormatLabel}`
                  }
                  onClick={() => void handleDownload()}
                  aria-label={
                    downloadActionDisabled
                      ? 'Download is not available for Code; use Copy'
                      : `Download selected icons as ${exportFormatLabel}`
                  }
                  leadingSlot={
                    isDownloading ? (
                      <SomeIcon
                        iconName="interface-loading"
                        iconStyle="outline"
                        iconSize="sm"
                        padding="050"
                        className="animate-spin"
                      />
                    ) : (
                      <SomeIcon
                        iconName="arrow-down"
                        iconStyle="outline"
                        iconSize="sm"
                        padding="050"
                      />
                    )
                  }
                />
                </div>
                <div className="ds-segmentedControl__dividerWrap" aria-hidden>
                  <div className="ds-segmentedControl__divider" />
                </div>
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="md"
                  className="ds-bulkActionBar__dismiss"
                  aria-label="Clear selection and exit selection mode"
                  title="Clear selection"
                  onClick={() => clearSelection()}
                  leadingSlot={
                    <SomeIcon
                      iconName="symbol-multiply"
                      iconStyle="outline"
                      iconSize="sm"
                      padding="050"
                    />
                  }
                />
              </>
            </BulkActionBar>
          </GradientOverlay>
        </div>
      </main>
    </div>
  )
}
