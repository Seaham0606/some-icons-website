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
  className?: string
  iconStyle?: 'outline' | 'filled'
  variant?: 'default' | 'secondary'
  tint?: 'blue' | 'red'
}

export function SegmentedButton({ 
  isActive, 
  onClick, 
  disabled = false,
  leadingIcon,
  textString,
  trailingIcon,
  children,
  className,
  iconStyle = 'filled',
  variant = 'default',
  tint
}: SegmentedButtonProps) {
  // Use slot-based API if icons or textString are provided, otherwise fallback to children
  const useSlotAPI = leadingIcon || textString || trailingIcon

  const isSecondary = variant === 'secondary'
  
  // Get tint color classes for text and background
  const getTintClasses = () => {
    if (!tint) return { text: '', bg: '', hoverBg: '', border: '', hoverBorder: '' }
    
    if (tint === 'blue') {
      return {
        text: 'text-[var(--color-blue-500)]',
        bg: 'bg-[var(--color-blue-alpha-50)] dark:bg-[var(--color-blue-alpha-25)]',
        hoverBg: 'hover:bg-[var(--color-blue-alpha-75)] dark:hover:bg-[var(--color-blue-alpha-50)]',
        border: 'border border-[var(--color-blue-alpha-25)]',
        hoverBorder: 'hover:border-[var(--color-blue-alpha-75)]'
      }
    } else if (tint === 'red') {
      return {
        text: 'text-[var(--color-red-500)]',
        bg: 'bg-[var(--color-red-alpha-50)] dark:bg-[var(--color-red-alpha-25)]',
        hoverBg: 'hover:bg-[var(--color-red-alpha-75)] dark:hover:bg-[var(--color-red-alpha-50)]',
        border: 'border border-[var(--color-red-alpha-25)]',
        hoverBorder: 'hover:border-[var(--color-red-alpha-75)]'
      }
    }
    
    return { text: '', bg: '', hoverBg: '', border: '', hoverBorder: '' }
  }
  
  const tintClasses = getTintClasses()

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        isSecondary ? 'h-[44px]' : 'flex-1 h-full',
        isSecondary ? 'flex-1' : '',
        'rounded-[6px]',
        'flex items-center justify-center',
        'px-2 gap-2',
        'disabled:opacity-10',
        // Ultra-smooth transitions with longer duration and custom smooth easing
        'transition-[background-color,color,box-shadow,transform,font-weight,border-color] duration-500',
        '[transition-timing-function:cubic-bezier(0.33,1,0.68,1)]',
        'will-change-[background-color,color,box-shadow,border-color]',
        // Subtle scale effect on interaction
        'active:scale-[0.98]',
        'group',
        isSecondary
          ? tint 
            ? `${tintClasses.text} ${tintClasses.bg} ${tintClasses.hoverBg} ${tintClasses.border} ${tintClasses.hoverBorder}`
            : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-input-secondary-bg-hover)] hover:text-[var(--color-text-secondary-hover)]'
          : isActive
            ? 'bg-[var(--color-seg-button-bg)] text-[var(--color-text-primary-inverted)] font-semibold [box-shadow:inset_0_0_0_1px_var(--color-seg-button-stroke)]'
            : 'text-[var(--color-text-tertiary)] hover:bg-[var(--color-input-secondary-bg-hover)] hover:text-[var(--color-text-secondary-hover)]',
        className
      )}
    >
      {useSlotAPI ? (
        <>
          {leadingIcon && (
            <CdnIcon iconId={leadingIcon} style={iconStyle} className="w-5 h-5 shrink-0 transition-[opacity,color] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]" />
          )}
          {textString && (
            <span className={cn(
              'text-[15px] leading-[100%] select-none transition-[color,font-weight] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]',
              isActive ? '' : 'font-medium'
            )}>
              {textString}
            </span>
          )}
          {trailingIcon && (
            <CdnIcon iconId={trailingIcon} style={iconStyle} className="w-5 h-5 shrink-0 transition-[opacity,color] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]" />
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
