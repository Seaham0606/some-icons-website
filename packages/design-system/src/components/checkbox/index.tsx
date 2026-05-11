"use client"

import * as React from "react"
import { cn } from "../../utils"
import { SomeIcon } from "../some-icon"

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    "type" | "className" | "children"
  > {
  className?: string
  /** Text or element shown to the right of the control (optional). */
  children?: React.ReactNode
}

/**
 * Checkbox — matches Figma checkbox set (node 1089:9020): unchecked / unchecked hover /
 * checked / checked hover, using Some Icons `interface-checkbox-*` glyphs at 20px + 2px padding.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { className, id: idProp, disabled, children, ...inputProps },
    ref,
  ) {
    const autoId = React.useId()
    const id = idProp ?? autoId

    return (
      <label
        className={cn(
          "ds-checkbox",
          disabled && "ds-checkbox--disabled",
          className,
        )}
        data-component="checkbox"
        htmlFor={id}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="ds-checkbox__input"
          disabled={disabled}
          {...inputProps}
        />
        <span className="ds-checkbox__box" aria-hidden>
          <span className="ds-checkbox__glyph ds-checkbox__glyph--unchecked">
            <SomeIcon
              iconName="interface-checkbox-unchecked"
              iconStyle="outline"
              iconSize="sm"
              padding="050"
            />
          </span>
          <span className="ds-checkbox__glyph ds-checkbox__glyph--checked">
            <SomeIcon
              iconName="interface-checkbox-checked"
              iconStyle="fill"
              iconSize="sm"
              padding="050"
            />
          </span>
        </span>
        {children != null && children !== false ? (
          <span className="ds-checkbox__label label-sm">{children}</span>
        ) : null}
      </label>
    )
  },
)
