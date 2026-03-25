import * as React from "react"

import { Input as DSInput, nativeInputClassName, SomeIcon } from "design-system"

/** @deprecated Use `nativeInputClassName` from `design-system` */
export const inputBaseStyles = nativeInputClassName

export { nativeInputClassName } from "design-system"

interface InputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: string
  /** Passed to design-system `Input` — tints value text and CDN icons (`currentColor`). */
  contentColor?: React.CSSProperties["color"]
  leadingIcon?: {
    iconId: string
    style?: "outline" | "filled"
  }
  trailingIcons?: Array<{
    iconId: string
    style?: "outline" | "filled"
    onClick?: () => void
  }>
}

function toSomeIconStyle(
  s: "outline" | "filled" | undefined
): "outline" | "fill" {
  return s === "filled" ? "fill" : "outline"
}

function Input({ className, leadingIcon, trailingIcons, contentColor, ...props }: InputProps) {
  const leadingSlot = leadingIcon ? (
    <SomeIcon
      iconName={leadingIcon.iconId}
      iconStyle={toSomeIconStyle(leadingIcon.style)}
      iconSize="md"
      padding="2"
    />
  ) : undefined

  const trailingSlot =
    trailingIcons && trailingIcons.length > 0 ? (
      <div className="ds-input__trailingRow">
        {trailingIcons.map((icon, index) => (
          <button
            key={index}
            type="button"
            onClick={icon.onClick}
            className="ds-input__trailingAction"
            tabIndex={-1}
          >
            <SomeIcon
              iconName={icon.iconId}
              iconStyle={toSomeIconStyle(icon.style)}
              iconSize="sm"
              className="ds-input__trailingGlyph"
            />
          </button>
        ))}
      </div>
    ) : undefined

  return (
    <DSInput
      className={className}
      contentColor={contentColor}
      showLeading={Boolean(leadingSlot)}
      showTrailing={Boolean(trailingSlot)}
      leadingSlot={leadingSlot}
      trailingSlot={trailingSlot}
      {...props}
    />
  )
}

export { Input }
