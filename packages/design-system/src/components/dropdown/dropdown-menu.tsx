"use client"

/**
 * DropdownMenu — vertical stack wrapper for {@link Button} rows used as dropdown options.
 *
 * **Not the floating shell:** with `variant="overlay"`, {@link Dropdown} already portals
 * `.ds-dropdown__menuOverlay`. Place `DropdownMenu` inside `panelSlot`, then full-width
 * `variant="transparent"` buttons with {@link dropdownMenuOptionClassName}.
 */

import * as React from "react"
import { cn } from "../../utils"

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenu({ className, ...rest }: DropdownMenuProps) {
  return (
    <div
      className={cn("ds-dropdownMenu", className)}
      data-component="dropdown-menu"
      {...rest}
    />
  )
}

export interface DropdownMenuDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuDivider({ className, ...rest }: DropdownMenuDividerProps) {
  return (
    <div
      className={cn("ds-dropdownMenu__divider", className)}
      aria-hidden
      {...rest}
    />
  )
}

/** Full-width transparent {@link Button} row inside {@link DropdownMenu} (layout + selected surface). */
export const dropdownMenuOptionClassName = "ds-dropdownMenu__option" as const
