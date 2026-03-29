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
import {
  getCodeCopyCtaLabel,
  getDefaultCodeFramework,
} from '@/lib/code-export'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useFilterStore } from '@/stores/filterStore'
import { useUIStore } from '@/stores/uiStore'
import {
  Button,
  Chip,
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
import { ExportNoSelectionTooltip } from '@/components/export/ExportNoSelectionTooltip'
import { useIconExport } from '@/hooks/useIconExport'
import { getCategories, useIcons } from '@/hooks/useIcons'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'
import type { IconStyle } from '@/types/icon'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

/** Strips a conventional semver `v` prefix for accessible version phrases (display is customized via `Chip`). */
function stripLeadingV(version: string): string {
  return version.trim().replace(/^v(?=\d)/i, '')
}

/** Complete `#rgb` / `#rrggbb` only; returns normalized `#rrggbb` or null for empty / invalid. */
function normalizeHexInput(value: string): string | null {
  const t = value.trim()
  if (t === '' || t === '#') return null
  const m = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  let h = m[1]
  if (h.length === 3) {
    h = [...h].map((c) => c + c).join('')
  }
  return `#${h.toLowerCase()}`
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

const codeFramework = getDefaultCodeFramework()

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
  const [customizeSectionExpanded, setCustomizeSectionExpanded] = useState(true)
  const [exportSectionExpanded, setExportSectionExpanded] = useState(true)
  const exportSize = useExportStore((s) => s.size)
  const setExportSize = useExportStore((s) => s.setSize)
  const exportFormat = useExportStore((s) => s.format)
  const setExportFormat = useExportStore((s) => s.setFormat)
  const showExportValidation = useExportStore((s) => s.showValidationErrors)
  const validateExport = useExportStore((s) => s.validate)
  const [customizeHex, setCustomizeHex] = useState('')
  const [customExportSize, setCustomExportSize] = useState('')
  const [customExportSizeFocused, setCustomExportSizeFocused] = useState(false)

  const sizePresetValue = useMemo((): (typeof SIZE_PRESETS)[number] | null => {
    if (exportSize == null) return null
    return (SIZE_PRESETS as readonly number[]).includes(exportSize)
      ? (exportSize as (typeof SIZE_PRESETS)[number])
      : null
  }, [exportSize])

  const { sizeValid, formatValid } = validateExport()
  const sizeFieldError = showExportValidation && !sizeValid
  const formatFieldError = showExportValidation && !formatValid
  const isExportSizeRowExpanded =
    customExportSize.length > 0 || customExportSizeFocused

  const {
    handleExport,
    isExporting,
    selectionCount,
    buttonWrapRef: exportButtonWrapRef,
    noSelectionFeedback,
  } = useIconExport()

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

  const customizeHexTrimmed = customizeHex.trim()
  const hasUserHexInput =
    customizeHexTrimmed !== '' && customizeHexTrimmed !== '#'
  const canResetIconColor =
    hasUserHexInput || selectedColor !== null

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
          label="Customize"
          collapsible
          expanded={customizeSectionExpanded}
          onExpandedChange={(expanded) => {
            setCustomizeSectionExpanded(expanded)
            if (expanded && categoryDropdownOpen) {
              setCategoryDropdownOpen(false)
            }
          }}
          leadingSlot={
            <SomeIcon
              iconName="formatting-pencil-alt"
              iconStyle="outline"
              iconSize="sm"
            />
          }
          leadingColor="var(--color-main-secondary)"
          contentSlot={
            <InputField
              label="Color"
              showCol2
              col2Width="size-12"
              contentSlot={
                <Input
                  value={customizeHex}
                  onChange={(e) => {
                    const v = e.target.value
                    setCustomizeHex(v)
                    const trimmed = v.trim()
                    if (trimmed === '' || trimmed === '#') {
                      setIconColor(null)
                      return
                    }
                    const normalized = normalizeHexInput(v)
                    if (normalized) setIconColor(normalized)
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '') setCustomizeHex('#')
                  }}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v === '' || v === '#') {
                      setCustomizeHex('')
                      setIconColor(null)
                      return
                    }
                    const normalized = normalizeHexInput(v)
                    if (normalized) {
                      setCustomizeHex(normalized)
                      setIconColor(normalized)
                    }
                  }}
                  placeholder="default"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  trailingSlot={
                    <button
                      type="button"
                      className="ds-iconColor-reset"
                      aria-label="Reset icon color to default"
                      disabled={!canResetIconColor}
                      onClick={() => {
                        setCustomizeHex('')
                        setIconColor(null)
                      }}
                    >
                      <SomeIcon
                        iconName="arrow-undo"
                        iconStyle="outline"
                        iconSize="md"
                        padding="2"
                      />
                    </button>
                  }
                />
              }
              secondarySlot={
                <div
                  className="homepage-customize-colorPreview"
                  onMouseDownCapture={(e) => e.preventDefault()}
                  style={
                    selectedColor
                      ? ({
                          ['--homepage-customize-swatch']: selectedColor,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  <Input
                    readOnly
                    tabIndex={-1}
                    aria-label="Selected icon color preview"
                    contentColor={selectedColor ?? undefined}
                    leadingSlot={
                      <span
                        className={
                          selectedColor
                            ? 'homepage-customize-colorPreview__hideLeading'
                            : undefined
                        }
                        aria-hidden={!!selectedColor}
                      >
                        <SomeIcon
                          iconName="formatting-eyedropper"
                          iconStyle="fill"
                          iconSize="md"
                          padding="2"
                          color={selectedColor ?? undefined}
                        />
                      </span>
                    }
                    showLeading
                    showTrailing={false}
                  />
                </div>
              }
            />
          }
        />
        <InputSection
          label="Export"
          collapsible
          expanded={exportSectionExpanded}
          onExpandedChange={(expanded) => {
            setExportSectionExpanded(expanded)
            if (expanded && categoryDropdownOpen) {
              setCategoryDropdownOpen(false)
            }
          }}
          leadingSlot={
            <SomeIcon
              iconName="arrow-up-out"
              iconStyle="outline"
              iconSize="sm"
            />
          }
          leadingColor="var(--color-main-secondary)"
          contentSlot={
            <>
              <div className="homepage-export-metaFields">
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
                <div
                  className="homepage-export-sizeReveal"
                  data-expanded={
                    exportFormat !== 'code' ? 'true' : 'false'
                  }
                  aria-hidden={exportFormat === 'code' ? true : undefined}
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
                          onChange={(e) =>
                            handleCustomExportSizeChange(e.target.value)
                          }
                        />
                      }
                    />
                  </div>
                </div>
              </div>
              <div ref={exportButtonWrapRef} className="w-full">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  radius="lg"
                  disabled={isExporting}
                  onClick={() => void handleExport()}
                  aria-label={
                    exportFormat === 'code'
                      ? 'Copy React import for selected icons'
                      : 'Export selected icons'
                  }
                  leadingSlot={
                    isExporting ? (
                      <SomeIcon
                        iconName="interface-loading"
                        iconStyle="outline"
                        iconSize="sm"
                        padding="050"
                        className="animate-spin"
                      />
                    ) : undefined
                  }
                >
                  {isExporting
                    ? 'Exporting...'
                    : exportFormat === 'code'
                      ? getCodeCopyCtaLabel(codeFramework)
                      : selectionCount > 0
                        ? `Export ${selectionCount} icon${selectionCount > 1 ? 's' : ''}`
                        : 'Export'}
                </Button>
              </div>
              {noSelectionFeedback ? (
                <ExportNoSelectionTooltip
                  x={noSelectionFeedback.x}
                  y={noSelectionFeedback.y}
                  isDark={noSelectionFeedback.isDark}
                />
              ) : null}
            </>
          }
        />
      </Sidebar>

      <main className="homepage-main">
        <div className="homepage-pageContentWrap">
          <PageContent>
            <IconGrid
              gradientOverlayInsetPx={
                selectionCount > 0 ? GRADIENT_OVERLAY_HOME_HEIGHT_PX : 0
              }
            />
          </PageContent>
          <GradientOverlay
            visible={selectionCount > 0}
            fullWidth
            style={{ height: GRADIENT_OVERLAY_HOME_HEIGHT_PX }}
            progressiveBlur
            progressiveBlurIntensity={80}
            progressiveBlurPosition="bottom"
            backdropBlur={false}
          />
        </div>
      </main>
    </div>
  )
}
