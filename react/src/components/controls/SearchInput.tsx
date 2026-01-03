import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useFilterStore } from '@/stores/filterStore'

export function SearchInput() {
  const searchQuery = useFilterStore((state) => state.searchQuery)
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-tertiary" />
      <Input
        type="text"
        placeholder="Search icons..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 h-11 bg-background-weak border-0 focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  )
}
