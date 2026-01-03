import { useFilterStore } from '@/stores/filterStore'
import { useIcons, getCategories } from '@/hooks/useIcons'
import { ChevronDown } from 'lucide-react'

export function CategorySelect() {
  const { data: icons } = useIcons()
  const categories = getCategories(icons)
  const category = useFilterStore((state) => state.category)
  const setCategory = useFilterStore((state) => state.setCategory)

  return (
    <div className="relative h-11">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="
          w-full h-full px-3 pr-8 appearance-none
          rounded-[10px] bg-[var(--background-weak)]
          text-sm font-medium text-foreground
          cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]
        "
      >
        <option value="all">All icons</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className="capitalize">
            {cat}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--item-tertiary)] pointer-events-none"
      />
    </div>
  )
}
