import { getCategoryIcon, getCategoryLabel } from '@/lib/category-icons'
import { getCategories, useIcons } from '@/hooks/useIcons'
import { useFilterStore } from '@/stores/filterStore'
import type { IconStyle } from '@/types/icon'
import {
  DropdownMenu,
  DropdownOption,
  Input,
  InputField,
  InputSection,
  SegmentedControl,
  SomeIcon,
} from 'design-system'
import { useEffect, useRef } from 'react'

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
      {allCategories.map((cat) => (
        <div key={cat} ref={category === cat ? selectedRowRef : null}>
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
      ))}
    </DropdownMenu>
  )
}

const STYLE_SEGMENT_OPTIONS = [
  { value: 'outline' as const, label: 'Outline' },
  { value: 'filled' as const, label: 'Filled' },
] satisfies ReadonlyArray<{ value: IconStyle; label: string }>

export interface HomePageFilterStackProps {
  showSearch?: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  iconStyle: IconStyle
  onIconStyleChange: (style: IconStyle) => void
  categoryListClassName?: string
  categorySectionClassName?: string
}

export function HomePageFilterStack({
  showSearch = true,
  searchQuery,
  onSearchChange,
  iconStyle,
  onIconStyleChange,
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
    </>
  )
}
