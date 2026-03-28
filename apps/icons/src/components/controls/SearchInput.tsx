import { Input, SomeIcon } from 'design-system'
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
      showLeading
      leadingSlot={
        <SomeIcon
          iconName="interface-search"
          iconStyle="outline"
          iconSize="md"
          padding="2"
        />
      }
    />
  )
}
