import { getCategoryIcon, getCategoryLabel } from '@/lib/category-icons'
import type { ExportFormat } from '@/lib/constants'
import { getCategories, useIcons } from '@/hooks/useIcons'
import { useFilterStore } from '@/stores/filterStore'
import type { IconStyle } from '@/types/icon'
import {
  DropdownMenu,
  DropdownMenuDivider,
  DropdownOption,
  Input,
  InputField,
  InputSection,
  SegmentedControl,
  SomeIcon,
} from 'design-system'
import { Fragment, useEffect, useRef } from 'react'

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
  exportFormat: ExportFormat | null
  onExportFormatChange: (format: ExportFormat) => void
  formatFieldError: boolean
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
  exportFormat,
  onExportFormatChange,
  formatFieldError,
  categoryListClassName,
  categorySectionClassName,
}: HomePageFilterStackProps) {
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
        }
      />
    </>
  )
}
