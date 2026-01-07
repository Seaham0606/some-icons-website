import { Input } from '@/components/ui/input'
import { useFilterStore } from '@/stores/filterStore'

export function SearchInput() {
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery)

  return (
    <Input
      type="text"
      placeholder="Search icons..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      leadingIcon={{
        iconId: "general-search",
        style: "outline"
      }}
    />
  )
}
