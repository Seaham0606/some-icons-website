import { IconPreview } from './IconPreview'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { cn } from '@/lib/utils'
import { Circle, CircleCheck } from 'lucide-react'
import type { Icon } from '@/types/icon'

interface IconCardProps {
  icon: Icon
}

export function IconCard({ icon }: IconCardProps) {
  const style = useFilterStore((state) => state.style)
  const isSelected = useSelectionStore((state) => state.isSelected(icon.id))
  const toggle = useSelectionStore((state) => state.toggle)

  return (
    <button
      onClick={() => toggle(icon.id)}
      className={cn(
        'group relative aspect-square rounded-[10px] transition-all overflow-hidden cursor-pointer',
        'bg-background',
        'border border-border-subtle',
        'hover:bg-background-hover-light hover:border-primary',
        isSelected && 'border-primary'
      )}
    >
      <div className="w-full h-full grid place-items-center p-4">
        <IconPreview path={icon.files[style]} className="w-[60%] h-[60%]" />
      </div>

      {/* Selection indicator */}
      <div
        className={cn(
          'absolute top-2 left-2 w-5 h-5 rounded transition-opacity',
          'flex items-center justify-center',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        {isSelected ? (
          <CircleCheck className="w-5 h-5 text-primary" />
        ) : (
          <Circle className="w-5 h-5 text-[var(--item-disabled)]" />
        )}
      </div>
    </button>
  )
}
