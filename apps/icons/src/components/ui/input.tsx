import * as React from "react"

import { cn } from "@/lib/utils"
import { CdnIcon } from "./cdn-icon"

// Shared base styles for all input-like controls (Win2K style)
const inputBaseStyles = [
  "h-[22px] w-full min-w-0 rounded-none",
  "text-[11px] leading-[100%] font-normal",
  "bg-[var(--win-white)]",
  "border border-[var(--win-shadow)]",
  "px-2 py-0",
  "text-[var(--win-text)]",
  "placeholder:text-[var(--win-shadow)] placeholder:font-normal",
  "outline-none",
  "transition-none",
  "hover:border-[var(--win-dark-shadow)]",
  "focus:border-[var(--win-navy)]",
  "focus-visible:border-[var(--win-navy)]",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "selection:bg-[var(--win-titlebar)] selection:text-white",
  "[box-shadow:inset_1px_1px_0_var(--win-shadow),inset_-1px_-1px_0_var(--win-light)]",
  // File input specific styles
  "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-xs file:font-normal",
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
        onFocus={props.onFocus}
        onBlur={props.onBlur}
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
