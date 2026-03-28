"use client"

/**
 * Dropdown — trigger uses the same `.ds-input` shell as {@link Input};
 * wrap with {@link InputField} for a label row like other fields.
 */

import * as React from "react"
import { cn } from "../../utils"

export type DropdownStatus = "default" | "error"

/** Placeholder inside the leading 40×40 slot (same as {@link InputSlotPlaceholder}). */
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
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children" | "type" | "onTransitionEnd"
  > {
  className?: string
  /** Fires on the root (panel `grid-template-rows` / `margin-top` transitions bubble here). */
  onTransitionEnd?: React.TransitionEventHandler<HTMLDivElement>
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
   * Panel below the trigger when `expanded`. Omit or leave undefined to show
   * `DropdownPanelSlotPlaceholder`. Pass `null` to expand without a panel (e.g. chevron-only).
   */
  panelSlot?: React.ReactNode | null
  /** Sets value/slot color via `--ds-input-content-color` (`currentColor` for icons). */
  contentColor?: React.CSSProperties["color"]
  /** Full width instead of default 240px. */
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
      onTransitionEnd,
      onPointerDownCapture,
      ...rest
    },
    ref
  ) {
    const status: DropdownStatus =
      ariaInvalid === true || ariaInvalid === "true" ? "error" : statusProp

    const showLead = !empty && (showLeading ?? leadingSlot != null)
    const showTrail = showTrailing !== false

    const shellStyle: React.CSSProperties | undefined =
      contentColor !== undefined && contentColor !== null
        ? ({ ["--ds-input-content-color"]: contentColor } as React.CSSProperties)
        : undefined

    const lastPointerDownRef = React.useRef(0)
    const [keyboardFocusRing, setKeyboardFocusRing] = React.useState(false)

    const handlePointerDownCapture = React.useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
        lastPointerDownRef.current = performance.now()
        onPointerDownCapture?.(e)
      },
      [onPointerDownCapture]
    )

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
      <div
        className={cn("ds-dropdown", className)}
        data-component="dropdown"
        data-expanded={expanded ? "true" : undefined}
        data-full-width={fullWidth ? "true" : undefined}
        onTransitionEnd={onTransitionEnd}
      >
        <button
          ref={ref}
          type="button"
          className="ds-input ds-dropdown__trigger"
          style={shellStyle}
          data-part="trigger"
          data-status={status}
          data-filled={empty ? "false" : "true"}
          data-disabled={disabled ? "true" : undefined}
          data-has-leading={showLead ? "true" : undefined}
          data-has-trailing={showTrail ? "true" : undefined}
          data-focus-ring={keyboardFocusRing ? "true" : undefined}
          disabled={disabled}
          aria-expanded={expanded}
          aria-haspopup="listbox"
          aria-invalid={ariaInvalid}
          onPointerDownCapture={handlePointerDownCapture}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        >
          {showLead ? (
            <div className="ds-input__slot" data-part="leading">
              {leadingSlot ?? <DropdownLeadingSlotPlaceholder />}
            </div>
          ) : null}
          <div className="ds-input__field" data-part="field">
            <span className="ds-input__input ds-dropdown__value">{children}</span>
          </div>
          {showTrail ? (
            <div className="ds-input__slot" data-part="trailing">
              <span className="ds-dropdown__trailingRotate">
                {trailingSlot ?? <DropdownLeadingSlotPlaceholder />}
              </span>
            </div>
          ) : null}
        </button>
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
      </div>
    )
  }
)

export {
  LegacyDropdown,
  LegacyDropdownLeadingSlotPlaceholder,
  LegacyDropdownPanelSlotPlaceholder,
} from "./legacy"
export type { LegacyDropdownProps, LegacyDropdownStatus } from "./legacy"
