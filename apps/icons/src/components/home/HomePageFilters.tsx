import { getCategoryIcon, getCategoryLabel } from '@/lib/category-icons'
import type { ExportFormat } from '@/lib/constants'
import { SIZE_PRESETS } from '@/lib/constants'
import { getCategories, useIcons } from '@/hooks/useIcons'
import { useFilterStore } from '@/stores/filterStore'
import type { IconStyle } from '@/types/icon'
import {
  ColorField,
  DropdownMenu,
  DropdownMenuDivider,
  DropdownOption,
  Input,
  InputField,
  InputSection,
  SegmentedControl,
  SomeIcon,
} from 'design-system'
import {
  Fragment,
  useEffect,
  useRef,
  type KeyboardEvent,
} from 'react'

export function HomeCategoryList({
  listClassName,
}: {
  listClassName?: string
}) {
  const { data: icons } = useIcons()
  const categories = getCategories(icons)
  const category = useFilterStore((s) => s.category)
  const setCategory = useFilterStore((s) => s.setCategory)
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
      className={listClassName ?? 'homepage-categoryList'}
      role="listbox"
      aria-label="Categories"
    >
      {allCategories.map((cat, index) => (
        <Fragment key={cat}>
          <div ref={category === cat ? selectedRowRef : null}>
            <DropdownOption
              role="option"
              selected={category === cat}
              leadingSlot={
                <SomeIcon
                  iconName={getCategoryIcon(cat)}
                  iconStyle="outline"
                  iconSize="sm"
                  padding="050"
                />
              }
              onClick={() => setCategory(cat)}
            >
              {getCategoryLabel(cat)}
            </DropdownOption>
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

const EXPORT_FORMAT_OPTIONS = [
  { value: 'svg' as const, label: 'SVG' },
  { value: 'png' as const, label: 'PNG' },
  { value: 'code' as const, label: 'Code' },
]

export interface HomePageFilterStackProps {
  showSearch?: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  iconStyle: IconStyle
  onIconStyleChange: (style: IconStyle) => void
  settingsSectionExpanded: boolean
  onSettingsSectionExpandedChange: (expanded: boolean) => void
  selectedColor: string | null
  onColorChange: (color: string | null) => void
  sizePresetValue: (typeof SIZE_PRESETS)[number] | null
  onExportPresetSize: (preset: (typeof SIZE_PRESETS)[number]) => void
  customExportSize: string
  onCustomExportSizeFocus: () => void
  onCustomExportSizeBlur: () => void
  onCustomExportSizeChange: (raw: string) => void
  onCustomExportSizeKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  exportFormat: ExportFormat | null
  onExportFormatChange: (format: ExportFormat) => void
  sizeFieldError: boolean
  formatFieldError: boolean
  isExportSizeRowExpanded: boolean
  categoryListClassName?: string
  categorySectionClassName?: string
}

export function HomePageFilterStack({
  showSearch = true,
  searchQuery,
  onSearchChange,
  iconStyle,
  onIconStyleChange,
  settingsSectionExpanded,
  onSettingsSectionExpandedChange,
  selectedColor,
  onColorChange,
  sizePresetValue,
  onExportPresetSize,
  customExportSize,
  onCustomExportSizeFocus,
  onCustomExportSizeBlur,
  onCustomExportSizeChange,
  onCustomExportSizeKeyDown,
  exportFormat,
  onExportFormatChange,
  sizeFieldError,
  formatFieldError,
  isExportSizeRowExpanded,
  categoryListClassName,
  categorySectionClassName,
}: HomePageFilterStackProps) {
  const EXPORT_SIZE_OPTIONS = SIZE_PRESETS.map((size) => ({
    value: size,
    label: String(size),
  }))

  return (
    <>
      <InputSection
        showLabel={false}
        className="homepage-sidebarSection--hug"
        contentSlot={
          <>
            {showSearch ? (
              <InputField
                showLabel={false}
                contentSlot={
                  <Input
                    type="text"
                    placeholder="Search icons..."
                    autoComplete="off"
                    aria-label="Search icons"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
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
            ) : null}
            <InputField
              label="Style"
              contentSlot={
                <SegmentedControl<IconStyle>
                  options={STYLE_SEGMENT_OPTIONS}
                  value={iconStyle}
                  onChange={onIconStyleChange}
                />
              }
            />
          </>
        }
      />
      <InputSection
        showLabel={false}
        className={
          categorySectionClassName ?? 'homepage-sidebarCategorySection'
        }
        contentSlot={
          <HomeCategoryList listClassName={categoryListClassName} />
        }
      />
      <InputSection
        className="homepage-sidebarSection--hug"
        label="Settings"
        collapsible
        expanded={settingsSectionExpanded}
        onExpandedChange={onSettingsSectionExpandedChange}
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
              <ColorField color={selectedColor} onColorChange={onColorChange} />
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
                        onChange={onExportPresetSize}
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
                        onFocus={onCustomExportSizeFocus}
                        onBlur={onCustomExportSizeBlur}
                        onKeyDown={onCustomExportSizeKeyDown}
                        onChange={(e) =>
                          onCustomExportSizeChange(e.target.value)
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
                    onChange={onExportFormatChange}
                    hasError={formatFieldError}
                  />
                }
              />
            </div>
          </>
        }
      />
    </>
  )
}
