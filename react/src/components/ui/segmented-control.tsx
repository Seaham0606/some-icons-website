import { cn } from '@/lib/utils'
import * as React from 'react'
import { CdnIcon } from '@/components/ui/cdn-icon'

interface SegmentedControlOption<T extends string | number> {
  value: T
  label: string
  leadingIcon?: string
  trailingIcon?: string
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentedControlOption<T>[]
  value: T | null
  onChange: (value: T) => void
  className?: string
  hasError?: boolean
}

interface SegmentedButtonProps {
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  leadingIcon?: string
  textString?: string
  trailingIcon?: string
  children?: React.ReactNode
}

function SegmentedButton({ 
  isActive, 
  onClick, 
  disabled = false,
  leadingIcon,
  textString,
  trailingIcon,
  children 
}: SegmentedButtonProps) {
  // Use slot-based API if icons or textString are provided, otherwise fallback to children
  const useSlotAPI = leadingIcon || textString || trailingIcon

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex-1 h-full rounded-[6px] transition-all',
        'flex items-center justify-center',
        'px-3 gap-2',
        'disabled:opacity-10',
        isActive
          ? 'bg-[var(--color-seg-button-bg)] text-[var(--color-text-primary-inverted)] hover:bg-[var(--color-seg-button-bg-hover)] font-semibold [box-shadow:inset_0_0_0_1px_var(--color-seg-button-stroke)]'
          : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-input-secondary-bg-hover)]'
      )}
    >
      {useSlotAPI ? (
        <>
          {leadingIcon && (
            <CdnIcon iconId={leadingIcon} className="w-5 h-5 shrink-0" />
          )}
          {textString && (
            <span className={cn(
              'text-[15px] leading-[100%] select-none',
              isActive ? '' : 'font-medium'
            )}>
              {textString}
            </span>
          )}
          {trailingIcon && (
            <CdnIcon iconId={trailingIcon} className="w-5 h-5 shrink-0" />
          )}
        </>
      ) : (
        children
      )}
    </button>
  )
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
      'flex w-full h-[44px] rounded-[10px] bg-[var(--color-input-bg)] border border-[var(--color-input-stroke)]',
      'p-1 gap-1 items-center',
      'hover:border-[var(--color-input-stroke-hover)]',
      hasError && 'ring-2 ring-[var(--color-warning)]',
      className
    )}>
      {options.map((option, index) => (
        <React.Fragment key={String(option.value)}>
          {index > 0 && (
            <div className="flex items-center h-3">
              <div className="h-3 w-px rounded-full bg-[var(--color-divider-stroke)]" />
            </div>
          )}
          <SegmentedButton
            isActive={value === option.value}
            onClick={() => onChange(option.value)}
            leadingIcon={option.leadingIcon}
            textString={option.label}
            trailingIcon={option.trailingIcon}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
