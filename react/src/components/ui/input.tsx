import * as React from "react"

import { cn } from "@/lib/utils"
import { CdnIcon } from "./cdn-icon"

// Shared base styles for all input-like controls
const inputBaseStyles = [
  "h-[44px] w-full min-w-0 rounded-[10px]",
  "text-[15px] leading-[100%] font-medium",
  "bg-[var(--color-input-bg)]",
  "border border-[var(--color-input-stroke)]",
  "p-3",
  "text-[var(--color-text-primary)]",
  "placeholder:text-[var(--color-text-tertiary)] placeholder:font-medium",
  "outline-none",
  "transition-[border-color,box-shadow,background-color]",
  "hover:border-[var(--color-input-stroke-hover)]",
  "focus:border-[var(--color-input-stroke-typing)]",
  "focus-visible:border-[var(--color-input-stroke-typing)]",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "selection:bg-primary selection:text-primary-foreground",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  // File input specific styles
  "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
]

interface InputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: string
  leadingIcon?: {
    iconId: string
    style?: 'outline' | 'filled'
  }
  trailingIcons?: Array<{
    iconId: string
    style?: 'outline' | 'filled'
    onClick?: () => void
  }>
}

function Input({ className, leadingIcon, trailingIcons, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false)

  // Calculate right padding for trailing icons
  // 12px base + (icon width * count) + (gap * (count - 1)) + 8px gap after last icon
  const trailingPadding = trailingIcons && trailingIcons.length > 0
    ? 12 + (trailingIcons.length * 20) + ((trailingIcons.length - 1) * 8) + 8
    : undefined

  return (
    <div className="relative w-full">
      {/* Leading icon */}
      {leadingIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center pointer-events-none text-[var(--color-text-tertiary)]">
          <CdnIcon 
            iconId={leadingIcon.iconId} 
            className="h-5 w-5" 
            style={leadingIcon.style || 'outline'} 
          />
        </div>
      )}

      {/* Input field */}
      <input
        type={props.type}
        data-slot="input"
        className={cn(
          inputBaseStyles,
          leadingIcon && "pl-[40px]", // 12px base padding + 20px icon + 8px gap
          className
        )}
        style={{
          ...(trailingPadding && { paddingRight: `${trailingPadding}px` })
        }}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        {...props}
      />

      {/* Trailing icons */}
      {trailingIcons && trailingIcons.length > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {trailingIcons.map((icon, index) => (
            <button
              key={index}
              type="button"
              onClick={icon.onClick}
              className="h-5 w-5 flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity text-[var(--color-text-tertiary)]"
              tabIndex={-1}
            >
              <CdnIcon 
                iconId={icon.iconId} 
                className="h-5 w-5" 
                style={icon.style || 'outline'} 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Input }
export { inputBaseStyles }
