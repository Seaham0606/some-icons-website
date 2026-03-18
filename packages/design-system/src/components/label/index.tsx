"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "../../utils"

function Label({
  className,
  style,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "ds-label",
        className
      )}
      style={{
        paddingLeft: "var(--spacing-050)",
        paddingRight: "var(--spacing-050)",
        gap: "var(--spacing-2)",
        ...style,
      }}
      {...props}
    />
  )
}

export { Label }
