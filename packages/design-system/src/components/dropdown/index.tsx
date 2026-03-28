"use client"

/**
 * Dropdown trigger — Figma node 490:5420.
 * Pass `leadingSlot` / `trailingSlot` with e.g. `<SomeIcon iconName="…" iconSize="md" padding="2" />`.
 */

import * as React from "react"
import { cn } from "../../utils"

export type DropdownStatus = "default" | "error"

/** Placeholder inside the leading 40×40 slot (same chrome as `InputSlotPlaceholder`). */
export function DropdownLeadingSlotPlaceholder() {
  return (
    <div
      className="ds-input__slotPlaceholder"
      data-part="slot-placeholder"
      aria-hidden
    />
  )
}

/** Placeholder for the expandable panel region below the header (Figma dashed slot). */
export function DropdownPanelSlotPlaceholder() {
  return (
    <div
      className="ds-dropdown__panelPlaceholder"
      data-part="slot-placeholder"
      aria-hidden
    />
  )
}

export interface DropdownProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "type"> {
  className?: string
  /** Label / value text in the header row */
  children?: React.ReactNode
  /** When true, placeholder styling and no leading column (Figma `selected=false`). */
  empty?: boolean
  /** Open state; panel region renders when true. */
  expanded?: boolean
  status?: DropdownStatus
  showLeading?: boolean
  /** When false, hides the trailing column. Default: true (Figma always shows chevron). */
  showTrailing?: boolean
  /** Leading 40×40 slot; use `<SomeIcon iconSize="md" padding="2" … />`. */
  leadingSlot?: React.ReactNode
  trailingSlot?: React.ReactNode
  /**
   * Panel below the header when `expanded`. Omit or leave undefined to show
   * `DropdownPanelSlotPlaceholder`. Pass `null` to expand without a panel (e.g. chevron-only).
   */
  panelSlot?: React.ReactNode | null
  /** Sets `color` for label + slots (`currentColor` for icons). */
  contentColor?: React.CSSProperties["color"]
  /** Span container width instead of Figma default 240px. */
  fullWidth?: boolean
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  function Dropdown(
    {
      className,
      children,
      empty = false,
      expanded = false,
      status: statusProp = "default",
      disabled = false,
      showLeading,
      showTrailing = true,
      leadingSlot,
      trailingSlot,
      panelSlot,
      contentColor,
      fullWidth = false,
      "aria-invalid": ariaInvalid,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) {
    const status: DropdownStatus =
      ariaInvalid === true || ariaInvalid === "true" ? "error" : statusProp

    const showLead =
      !empty && (showLeading ?? leadingSlot != null)
    const showTrail = showTrailing !== false

    const shellStyle: React.CSSProperties | undefined =
      contentColor !== undefined && contentColor !== null
        ? ({ ["--ds-dropdown-content-color"]: contentColor } as React.CSSProperties)
        : undefined

    const lastPointerDownRef = React.useRef(0)
    const [keyboardFocusRing, setKeyboardFocusRing] = React.useState(false)

    const handlePointerDownCapture = React.useCallback(() => {
      lastPointerDownRef.current = performance.now()
    }, [])

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        const dt = performance.now() - lastPointerDownRef.current
        const fromPointer = dt >= 0 && dt < 120
        lastPointerDownRef.current = 0
        if (fromPointer) {
          setKeyboardFocusRing(false)
        } else {
          requestAnimationFrame(() => {
            const el = e.currentTarget
            if (el.matches(":focus-visible")) {
              setKeyboardFocusRing(true)
            } else {
              setKeyboardFocusRing(false)
            }
          })
        }
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        setKeyboardFocusRing(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    return (
      <button
        ref={ref}
        type="button"
        className={cn("ds-dropdown", className)}
        style={shellStyle}
        data-component="dropdown"
        data-status={status}
        data-disabled={disabled ? "true" : undefined}
        data-empty={empty ? "true" : undefined}
        data-expanded={expanded ? "true" : undefined}
        data-has-leading={showLead ? "true" : undefined}
        data-has-trailing={showTrail ? "true" : undefined}
        data-focus-ring={keyboardFocusRing ? "true" : undefined}
        data-full-width={fullWidth ? "true" : undefined}
        disabled={disabled}
        aria-expanded={expanded}
        aria-haspopup="listbox"
        aria-invalid={ariaInvalid}
        onPointerDownCapture={handlePointerDownCapture}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        <span className="ds-dropdown__headerRow" data-part="header-row">
          {showLead ? (
            <span className="ds-dropdown__slot" data-part="leading">
              {leadingSlot ?? <DropdownLeadingSlotPlaceholder />}
            </span>
          ) : null}
          <span className="ds-dropdown__labelWrap" data-part="label">
            <span className="ds-dropdown__label">{children}</span>
          </span>
          {showTrail ? (
            <span className="ds-dropdown__slot" data-part="trailing">
              <span className="ds-dropdown__trailingRotate">
                {trailingSlot ?? <DropdownLeadingSlotPlaceholder />}
              </span>
            </span>
          ) : null}
        </span>
        {panelSlot !== null ? (
          <span
            className="ds-dropdown__panel"
            data-part="panel"
            aria-hidden={expanded ? undefined : true}
          >
            <span className="ds-dropdown__panelMotion">
              {panelSlot === undefined ? (
                <DropdownPanelSlotPlaceholder />
              ) : (
                panelSlot
              )}
            </span>
          </span>
        ) : null}
      </button>
    )
  }
)
