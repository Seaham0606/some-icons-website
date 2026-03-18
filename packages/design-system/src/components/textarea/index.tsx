import * as React from "react"
import { cn } from "../../utils"

function Textarea({ className, style, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn("ds-textarea", className)}
      style={{
        minHeight: "var(--size-16)",
        paddingLeft: "var(--spacing-3)",
        paddingRight: "var(--spacing-3)",
        paddingTop: "var(--spacing-2)",
        paddingBottom: "var(--spacing-2)",
        borderRadius: "var(--radius-md)",
        ...style,
      }}
      {...props}
    />
  )
}

export { Textarea }
