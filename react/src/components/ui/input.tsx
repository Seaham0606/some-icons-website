import * as React from "react"

import { cn } from "@/lib/utils"

// Shared base styles for all input-like controls
const inputBaseStyles = [
  "h-12 w-full min-w-0 rounded-[10px]",
  "text-base font-semibold",
  "bg-[var(--background-weak)]",
  "border-0",
  "px-3 py-1",
  "text-foreground placeholder:text-[var(--foreground-tertiary)] placeholder:font-semibold placeholder:leading-normal",
  "outline-none",
  "transition-[border-color,box-shadow,background-color]",
  "hover:bg-[var(--background-active-dark)]",
  "focus:border focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)]",
  "focus-visible:border focus-visible:border-[var(--border-focus)] focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "selection:bg-primary selection:text-primary-foreground",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  // File input specific styles
  "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
]

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputBaseStyles, className)}
      {...props}
    />
  )
}

export { Input }
export { inputBaseStyles }
