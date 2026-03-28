"use client"

/**
 * Legacy dropdown (v1) — Figma Dropdown 490:5420.
 * Prefer {@link Dropdown} for input-aligned chrome. Kept for gradual migration.
 */

import * as React from "react"
import { cn } from "../../utils"

export type LegacyDropdownStatus = "default" | "error"

/** @deprecated Use {@link DropdownLeadingSlotPlaceholder} */
export function LegacyDropdownLeadingSlotPlaceholder() {
  return (
    <div
      className="ds-input__slotPlaceholder"
      data-part="slot-placeholder"
      aria-hidden
    />
  )
}

/** @deprecated Use {@link DropdownPanelSlotPlaceholder} with the new Dropdown. */
export function LegacyDropdownPanelSlotPlaceholder() {
  return (
    <div
      className="ds-dropdownLegacy__panelPlaceholder"
      data-part="slot-placeholder"
      aria-hidden
    />
  )
}

export interface LegacyDropdownProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "type"> {
  className?: string
  /** Label / value text in the header row */
  children?: React.ReactNode
  /** When true, placeholder styling and no leading column (Figma `selected=false`). */
  empty?: boolean
  /** Open state; panel region renders when true. */
  expanded?: boolean
  status?: LegacyDropdownStatus
  showLeading?: boolean
  /** When false, hides the trailing column. Default: true (Figma always shows chevron). */
  showTrailing?: boolean
  /** Leading 40×40 slot; use `<SomeIcon iconSize="md" padding="2" … />`. */
  leadingSlot?: React.ReactNode
  trailingSlot?: React.ReactNode
  /**
   * Panel below the header when `expanded`. Omit or leave undefined to show
   * `LegacyDropdownPanelSlotPlaceholder`. Pass `null` to expand without a panel (e.g. chevron-only).
   */
  panelSlot?: React.ReactNode | null
  /** Sets `color` for label + slots (`currentColor` for icons). */
  contentColor?: React.CSSProperties["color"]
  /** Span container width instead of Figma default 240px. */
  fullWidth?: boolean
}

export const LegacyDropdown = React.forwardRef<HTMLButtonElement, LegacyDropdownProps>(
  function LegacyDropdown(
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
    const status: LegacyDropdownStatus =
      ariaInvalid === true || ariaInvalid === "true" ? "error" : statusProp

    const showLead = !empty && (showLeading ?? leadingSlot != null)
    const showTrail = showTrailing !== false

    const shellStyle: React.CSSProperties | undefined =
      contentColor !== undefined && contentColor !== null
        ? ({ ["--ds-dropdownLegacy-content-color"]: contentColor } as React.CSSProperties)
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
        className={cn("ds-dropdownLegacy", className)}
        style={shellStyle}
        data-component="dropdown-legacy"
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
        <span className="ds-dropdownLegacy__headerRow" data-part="header-row">
          {showLead ? (
            <span className="ds-dropdownLegacy__slot" data-part="leading">
              {leadingSlot ?? <LegacyDropdownLeadingSlotPlaceholder />}
            </span>
          ) : null}
          <span className="ds-dropdownLegacy__labelWrap" data-part="label">
            <span className="ds-dropdownLegacy__label">{children}</span>
          </span>
          {showTrail ? (
            <span className="ds-dropdownLegacy__slot" data-part="trailing">
              <span className="ds-dropdownLegacy__trailingRotate">
                {trailingSlot ?? <LegacyDropdownLeadingSlotPlaceholder />}
              </span>
            </span>
          ) : null}
        </span>
        {panelSlot !== null ? (
          <span
            className="ds-dropdownLegacy__panel"
            data-part="panel"
            aria-hidden={expanded ? undefined : true}
          >
            <span className="ds-dropdownLegacy__panelMotion">
              {panelSlot === undefined ? (
                <LegacyDropdownPanelSlotPlaceholder />
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
