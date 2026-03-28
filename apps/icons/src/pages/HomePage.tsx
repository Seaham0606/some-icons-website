import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import { PageContent } from '@/components/layout/PageContent'
import { IconGrid } from '@/components/icons/IconGrid'
import type { ExportFormat } from '@/lib/constants'
import { SIZE_PRESETS } from '@/lib/constants'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useFilterStore } from '@/stores/filterStore'
import { useUIStore } from '@/stores/uiStore'
import {
  Button,
  Dropdown,
  Input,
  InputField,
  InputSection,
  SegmentedControl,
  Sidebar,
  SomeIcon,
  ThemeButton,
} from 'design-system'
import { ExportNoSelectionTooltip } from '@/components/export/ExportNoSelectionTooltip'
import { useIconExport } from '@/hooks/useIconExport'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'
import type { IconStyle } from '@/types/icon'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, TransitionEvent } from 'react'

/** Matches `--ds-dropdown-duration` in design-system `components.css` + small buffer. */
const CATEGORY_DROPDOWN_TRANSITION_MS = 400

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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  /** Captures Customize/Export expanded state when opening the category dropdown; restored when it closes. */
  const sectionsBeforeCategoryDropdownRef = useRef<{
    customize: boolean
    export: boolean
  } | null>(null)
  /** Keeps `homepage-sidebar--category-dropdown-open` through panel close so flex/ grid transitions can finish. */
  const [categorySidebarLayoutOpen, setCategorySidebarLayoutOpen] = useState(false)
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

  const categoryDropdownOpenRef = useRef(categoryDropdownOpen)
  categoryDropdownOpenRef.current = categoryDropdownOpen

  const layoutHoldFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const restoreSectionsFromCategoryDropdownSnapshot = useCallback(() => {
    const snap = sectionsBeforeCategoryDropdownRef.current
    if (!snap) return
    setCustomizeSectionExpanded(snap.customize)
    setExportSectionExpanded(snap.export)
    sectionsBeforeCategoryDropdownRef.current = null
  }, [])

  useEffect(() => {
    if (categoryDropdownOpen) {
      setCategorySidebarLayoutOpen(true)
    }
  }, [categoryDropdownOpen])

  const releaseCategorySidebarLayout = useCallback(() => {
    if (layoutHoldFallbackRef.current !== null) {
      clearTimeout(layoutHoldFallbackRef.current)
      layoutHoldFallbackRef.current = null
    }
    setCategorySidebarLayoutOpen(false)
  }, [])

  const handleCategoryDropdownTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (categoryDropdownOpenRef.current) return
      const el = event.target
      if (!(el instanceof HTMLElement)) return
      if (el.dataset.part !== 'panel') return
      if (
        event.propertyName !== 'grid-template-rows' &&
        event.propertyName !== 'margin-top'
      ) {
        return
      }
      /* Trigger close: panel collapse finished → drop category layout, then open Customize/Export. */
      releaseCategorySidebarLayout()
      restoreSectionsFromCategoryDropdownSnapshot()
    },
    [releaseCategorySidebarLayout, restoreSectionsFromCategoryDropdownSnapshot]
  )

  useEffect(() => {
    if (categoryDropdownOpen) return
    if (!categorySidebarLayoutOpen) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (layoutHoldFallbackRef.current !== null) {
      clearTimeout(layoutHoldFallbackRef.current)
    }
    layoutHoldFallbackRef.current = setTimeout(() => {
      layoutHoldFallbackRef.current = null
      releaseCategorySidebarLayout()
      restoreSectionsFromCategoryDropdownSnapshot()
    }, reduced ? 0 : CATEGORY_DROPDOWN_TRANSITION_MS)

    return () => {
      if (layoutHoldFallbackRef.current !== null) {
        clearTimeout(layoutHoldFallbackRef.current)
        layoutHoldFallbackRef.current = null
      }
    }
  }, [
    categoryDropdownOpen,
    categorySidebarLayoutOpen,
    releaseCategorySidebarLayout,
    restoreSectionsFromCategoryDropdownSnapshot,
  ])

  return (
    <div className="homepage-shell">
      <Sidebar
        className={
          categoryDropdownOpen || categorySidebarLayoutOpen
            ? 'homepage-sidebar--category-dropdown-open'
            : undefined
        }
        pageName="Icon library"
        version={version}
        versionChipVariant="beta"
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
                    expanded={categoryDropdownOpen}
                    onClick={() => {
                      if (categoryDropdownOpen) {
                        setCategoryDropdownOpen(false)
                        return
                      }
                      sectionsBeforeCategoryDropdownRef.current = {
                        customize: customizeSectionExpanded,
                        export: exportSectionExpanded,
                      }
                      setCustomizeSectionExpanded(false)
                      setExportSectionExpanded(false)
                      setCategoryDropdownOpen(true)
                    }}
                    onTransitionEnd={handleCategoryDropdownTransitionEnd}
                    panelSlot={
                      <div
                        className="homepage-category-dropdown-panel"
                        role="listbox"
                        aria-label="Categories"
                      >
                        {/*
                          Future categories: on select: setCategoryDropdownOpen(false); restore
                          runs after panel transition (or layout timeout). Also update label.
                        */}
                      </div>
                    }
                    leadingSlot={
                      <SomeIcon
                        iconName="interface-grid"
                        iconStyle="outline"
                        iconSize="md"
                        padding="2"
                        color="var(--color-main-primary)"
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
                    Category name
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
              const snap = sectionsBeforeCategoryDropdownRef.current
              if (snap) {
                setExportSectionExpanded(snap.export)
                sectionsBeforeCategoryDropdownRef.current = null
              }
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
              const snap = sectionsBeforeCategoryDropdownRef.current
              if (snap) {
                setCustomizeSectionExpanded(snap.customize)
                sectionsBeforeCategoryDropdownRef.current = null
              }
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
              <div ref={exportButtonWrapRef} className="w-full">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  radius="lg"
                  disabled={isExporting}
                  onClick={() => void handleExport()}
                  aria-label="Export selected icons"
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
        <PageContent>
          <IconGrid />
        </PageContent>
      </main>
    </div>
  )
}
