import { cn } from '@/lib/utils'
import * as React from 'react'

interface SegmentedControlOption<T extends string | number> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[]
  value: T | null
  onChange: (value: T) => void
  className?: string
  hasError?: boolean
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
  hasError = false,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn(
      'flex rounded-[10px] bg-[var(--background-weak)] p-1 gap-1 h-12 items-center',
      hasError && 'ring-2 ring-[var(--color-warning)]',
      className
    )}>
      {options.map((option, index) => (
        <React.Fragment key={String(option.value)}>
          {index > 0 && (
            <div className="flex items-center">
              <div className="h-3 w-px bg-[var(--color-black-alpha-100)] dark:bg-[var(--color-white-alpha-100)]" />
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 h-full rounded-[7px] text-base font-semibold transition-all',
              'flex items-center justify-center',
              value === option.value
                ? 'bg-[var(--item-primary)] text-white dark:text-black'
                : 'text-[var(--foreground-tertiary)] font-semibold leading-normal hover:bg-[var(--background-hover)]'
            )}
          >
            {option.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  )
}
