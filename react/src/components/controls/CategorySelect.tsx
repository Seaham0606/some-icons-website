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
    <div className="relative w-full">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={cn(
          inputBaseStyles,
          "pr-[40px] appearance-none cursor-pointer"
        )}
      >
        <option value="all">All icons</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="capitalize">
            {cat}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center pointer-events-none text-[var(--color-text-tertiary)]">
        <CdnIcon iconId="arrow-down-triangle" className="h-5 w-5" />
      </div>
    </div>
  )
}
