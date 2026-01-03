import { cn } from '@/lib/utils'

interface SegmentedControlOption<T extends string | number> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[]
  value: T | null
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('flex rounded-[10px] bg-[var(--background-weak)] p-1 gap-2 h-11', className)}>
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'flex-1 h-full rounded-md text-sm font-medium transition-all',
            'flex items-center justify-center',
            value === option.value
              ? 'bg-[var(--item-primary)] text-[var(--foreground-inverted)]'
              : 'text-[var(--item-tertiary)] hover:bg-[var(--background-hover)]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
