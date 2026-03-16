"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../../utils"

function ThemeToggle({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="themeToggle"
      className={cn(
        "peer inline-flex h-5 w-10 shrink-0 items-center rounded-[100px] transition-colors outline-none cursor-pointer p-0.5",
        "bg-[var(--color-toggle-bg)]",
        "border border-[var(--color-toggle-stroke)]",
        "hover:border-[var(--color-toggle-stroke-hover)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="themeToggleThumb"
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full transition-transform",
          "bg-[var(--color-toggle-control-bg)] shadow-sm",
          "data-[state=checked]:translate-x-[19px] data-[state=unchecked]:translate-x-[-1px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { ThemeToggle }
