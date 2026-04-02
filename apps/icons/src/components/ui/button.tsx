import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { CdnIcon } from "@/components/ui/cdn-icon"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap outline-none disabled:opacity-50 win-raised cursor-default active:win-raised",
  {
    variants: {
      variant: {
        default: "bg-[var(--win-bg)] text-[var(--win-text)] text-[11px] leading-[100%] font-normal",
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
        default: "h-[23px] px-3",
        sm: "h-[20px] px-2",
        lg: "h-[26px] px-4",
        icon: "size-[23px]",
        "icon-sm": "size-[20px]",
        "icon-lg": "size-[26px]",
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
