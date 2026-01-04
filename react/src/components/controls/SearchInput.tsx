import { Input } from '@/components/ui/input'
import { CdnIcon } from '@/components/ui/cdn-icon'
import { useFilterStore } from '@/stores/filterStore'

export function SearchInput() {
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery)

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 pr-2 text-[var(--item-tertiary)]">
        <CdnIcon iconId="general-search" className="h-6 w-6" style="outline" />
      </div>
      <Input
        type="text"
        placeholder="Search icons..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
