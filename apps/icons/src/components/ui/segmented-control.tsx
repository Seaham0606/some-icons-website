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
  style?: React.CSSProperties
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
  style,
  iconStyle = 'filled',
  variant = 'default',
  tint
}: SegmentedButtonProps) {
  const useSlotAPI = leadingIcon || textString || trailingIcon

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'win-raised',
        'flex items-center justify-center',
        'px-3 gap-1',
        'h-[23px]',
        'disabled:opacity-50',
        'cursor-default',
        'text-[11px]',
        isActive ? 'font-bold underline' : 'font-normal',
        className
      )}
      style={{ borderRadius: 0, transition: 'none', fontFamily: "'Tahoma','MS Sans Serif',Arial,sans-serif", ...style }}
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
      'flex w-full gap-2 items-center flex-wrap',
      hasError && 'outline outline-2 outline-red-500',
      className
    )}>
      {options.map((option) => (
        <label
          key={String(option.value)}
          className="flex items-center gap-1 cursor-default select-none"
          style={{ fontSize: '11px', fontFamily: "'Tahoma','MS Sans Serif',Arial,sans-serif" }}
        >
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            style={{
              width: '13px',
              height: '13px',
              accentColor: 'var(--win-navy)',
              cursor: 'default',
            }}
          />
          {option.leadingIcon && (
            <CdnIcon iconId={option.leadingIcon} className="w-4 h-4" />
          )}
          <span>{option.label}</span>
          {option.trailingIcon && (
            <CdnIcon iconId={option.trailingIcon} className="w-4 h-4" />
          )}
        </label>
      ))}
    </div>
  )
}
