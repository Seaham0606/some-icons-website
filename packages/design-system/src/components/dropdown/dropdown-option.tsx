"use client"

import * as React from "react"
import { cn } from "../../utils"

export interface DropdownOptionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /**
   * Primary action (left block: leading + label). Use with keyboard like a menu row
   * (`Enter` / `Space` when the main control is focused).
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Optional leading glyph (e.g. `<SomeIcon iconName="…" iconSize="sm" padding="050" />`). */
  leadingSlot?: React.ReactNode
  children: React.ReactNode
  /**
   * Right column (e.g. {@link Checkbox}). Clicks do not fire `onClick` on the main control.
   */
  trailingSlot?: React.ReactNode
  disabled?: boolean
  /** Highlights the row (e.g. current value in an exposed list). */
  selected?: boolean
  /** Optional count badge shown on the right (e.g. number of icons in a category). */
  iconCount?: number
}

/**
 * Dropdown option row — Figma `DropdownOption` (e.g. 1089:8380): leading icon, label (16px / 500 / 1.1),
 * optional trailing control; hover uses `--color-overlay-accent`; disabled at 20% opacity.
 *
 * Place inside {@link DropdownMenu} (same contexts as {@link dropdownMenuOptionClassName} rows).
 */
export const DropdownOption = React.forwardRef<HTMLDivElement, DropdownOptionProps>(
  function DropdownOption(
    {
      className,
      leadingSlot,
      children,
      trailingSlot,
      iconCount,
      disabled = false,
      selected = false,
      onClick,
      role,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role={role}
        aria-selected={role === "option" ? selected : undefined}
        className={cn(
          "ds-dropdownOption",
          disabled && "ds-dropdownOption--disabled",
          className,
        )}
        data-component="dropdown-option"
        data-dropdown-option-selected={selected ? "true" : undefined}
        data-trailing={trailingSlot != null ? "true" : undefined}
        {...rest}
      >
        <button
          type="button"
          className="ds-dropdownOption__main"
          disabled={disabled}
          onClick={onClick}
        >
          {leadingSlot != null ? (
            <span className="ds-dropdownOption__leading">{leadingSlot}</span>
          ) : null}
          <span className="ds-dropdownOption__label">{children}</span>
          {iconCount != null ? (
            <span className="ds-dropdownOption__iconCount">{iconCount}</span>
          ) : null}
        </button>
        {trailingSlot != null ? (
          <div className="ds-dropdownOption__trailing">{trailingSlot}</div>
        ) : null}
      </div>
    )
  },
)
