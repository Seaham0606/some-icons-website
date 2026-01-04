import { useFilterStore } from '@/stores/filterStore'
import { useIcons, getCategories } from '@/hooks/useIcons'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { inputBaseStyles } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function CategorySelect() {
  const { data: icons } = useIcons()
  const categories = getCategories(icons)
  const category = useFilterStore((state) => state.category)
  const setCategory = useFilterStore((state) => state.setCategory)

  return (
    <div className="relative h-12">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={cn(
          inputBaseStyles,
          "pr-8 appearance-none cursor-pointer"
        )}
      >
        <option value="all">All icons</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="capitalize">
            {cat}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--item-tertiary)] pointer-events-none">
        <CdnIcon iconId="arrow-down-triangle" className="h-6 w-6" />
      </div>
    </div>
  )
}
