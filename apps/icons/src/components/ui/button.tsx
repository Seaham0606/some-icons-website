import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { CdnIcon } from "@/components/ui/cdn-icon"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:opacity-10",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-cta-button-bg)] text-[var(--color-cta-button-text)] hover:bg-[var(--color-cta-button-bg-hover)] text-[15px] leading-[100%]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[44px] px-3",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leadingIcon?: string
  textString?: string
  trailingIcon?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      fullWidth = false,
      asChild = false,
      leadingIcon,
      textString,
      trailingIcon,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    // If using new slot-based API, render with icons and text
    const useSlotAPI = leadingIcon || textString || trailingIcon

    if (useSlotAPI) {
      return (
        <Comp
          ref={ref}
          data-slot="button"
          data-variant={variant}
          data-size={size}
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          {...props}
        >
          {leadingIcon && (
            <CdnIcon iconId={leadingIcon} className="w-5 h-5 shrink-0" />
          )}
          {textString && (
            <span className="px-1 text-[15px] leading-[100%] select-none">
              {textString}
            </span>
          )}
          {trailingIcon && (
            <CdnIcon iconId={trailingIcon} className="w-5 h-5 shrink-0" />
          )}
        </Comp>
      )
    }

    // Fallback to children for backward compatibility
    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
