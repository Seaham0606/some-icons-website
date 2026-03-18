"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "../../utils"

function ThemeToggle({
  className,
  style,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="themeToggle"
      className={cn("ds-theme-toggle", className)}
      style={style}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="themeToggleThumb"
        className={cn("ds-theme-toggle__thumb")}
      />
    </SwitchPrimitive.Root>
  )
}

const Switch = ThemeToggle

export { ThemeToggle, Switch }
