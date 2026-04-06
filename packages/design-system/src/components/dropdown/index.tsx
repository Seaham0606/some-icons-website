"use client"

/**
 * Dropdown — trigger uses the same `.ds-input` shell as {@link Input};
 * wrap with {@link InputField} for a label row like other fields.
 *
 * For list-style `panelSlot` content, use {@link DropdownMenu} (and optional
 * {@link DropdownMenuDivider}) inside the overlay or inline menu — the portaled shell
 * stays on this component; the menu is layout/rows only.
 */

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../../utils"

/** Max height for portaled overlay (`variant="overlay"`); inner scrolls when content exceeds. */
const DROPDOWN_OVERLAY_MAX_HEIGHT_PX = 320

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

/** Placeholder for the expandable menu region below the header (Figma dashed slot). */
export function DropdownPanelSlotPlaceholder() {
  return (
    <div
      className="ds-dropdown__menuPlaceholder"
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
  /** Fires on the root (`grid-template-rows` / `margin-top` transitions on `.ds-dropdown__menu` bubble here). */
  onTransitionEnd?: React.TransitionEventHandler<HTMLDivElement>
  /** Label / value text in the header row */
  children?: React.ReactNode
  /** When true, placeholder styling and no leading column (Figma `selected=false`). */
  empty?: boolean
  /** Open state; menu region renders when true. */
  expanded?: boolean
  status?: DropdownStatus
  showLeading?: boolean
  /** When false, hides the trailing column. Default: true (Figma always shows chevron). */
  showTrailing?: boolean
  /** Leading 40×40 slot; use `<SomeIcon iconSize="md" padding="2" … />`. */
  leadingSlot?: React.ReactNode
  trailingSlot?: React.ReactNode
  /**
   * Menu content below the trigger when `expanded`. Omit or leave undefined to show
   * `DropdownPanelSlotPlaceholder`. Pass `null` to expand without a menu (e.g. chevron-only).
   */
  panelSlot?: React.ReactNode | null
  /** Sets value/slot color via `--ds-input-content-color` (`currentColor` for icons). */
  contentColor?: React.CSSProperties["color"]
  /** Full width instead of default 240px. */
  fullWidth?: boolean
  /**
   * `"inline"` (default): `.ds-dropdown__menu` expands in document flow below the trigger.
   * `"overlay"`: menu is portaled under `document.body`, fixed below the trigger; pass
   * {@link DropdownProps.onOverlayDismiss} for outside-click and Escape handling.
   */
  variant?: "inline" | "overlay"
  /**
   * When `variant="overlay"` and the menu is open: outside click and Escape.
   * Recommended whenever using the overlay variant.
   */
  onOverlayDismiss?: () => void
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
      variant = "inline",
      onOverlayDismiss,
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
    const isOverlay = variant === "overlay" && panelSlot !== null

    const overlayListId = React.useId()
    const triggerElRef = React.useRef<HTMLButtonElement | null>(null)
    const overlayPanelRef = React.useRef<HTMLDivElement | null>(null)
    const prevExpandedRef = React.useRef(expanded)
    const [overlayExitPending, setOverlayExitPending] = React.useState(false)
    const [overlayMotionOpen, setOverlayMotionOpen] = React.useState(false)
    const [overlayBox, setOverlayBox] = React.useState<{
      top: number
      left: number
      width: number
      maxHeight: number
    } | null>(null)

    const overlayActive = expanded || overlayExitPending

    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerElRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }
      },
      [ref],
    )

    const shellStyle: React.CSSProperties | undefined =
      contentColor !== undefined && contentColor !== null
        ? ({ ["--ds-input-content-color"]: contentColor } as React.CSSProperties)
        : undefined

    const lastPointerDownRef = React.useRef(0)
    const [keyboardFocusRing, setKeyboardFocusRing] = React.useState(false)

    const updateOverlayPosition = React.useCallback(() => {
      const el = triggerElRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const margin = 16
      /* Top-align with trigger so the overlay covers it (same `top` as trigger box). */
      const top = r.top
      const viewportCap = Math.max(120, window.innerHeight - top - margin)
      const maxHeight = Math.min(DROPDOWN_OVERLAY_MAX_HEIGHT_PX, viewportCap)
      let left = r.left
      const w = r.width
      const rightEdge = left + w
      if (rightEdge > window.innerWidth - margin) {
        left = Math.max(margin, window.innerWidth - margin - w)
      }
      if (left < margin) {
        left = margin
      }
      setOverlayBox({ top, left, width: w, maxHeight })
    }, [])

    React.useLayoutEffect(() => {
      if (!isOverlay || !overlayActive) return
      updateOverlayPosition()
    }, [overlayActive, isOverlay, updateOverlayPosition])

    React.useEffect(() => {
      if (!isOverlay || !overlayActive) return
      updateOverlayPosition()
      window.addEventListener("resize", updateOverlayPosition)
      window.addEventListener("scroll", updateOverlayPosition, true)
      return () => {
        window.removeEventListener("resize", updateOverlayPosition)
        window.removeEventListener("scroll", updateOverlayPosition, true)
      }
    }, [overlayActive, isOverlay, updateOverlayPosition])

    React.useEffect(() => {
      if (!isOverlay) return
      const prev = prevExpandedRef.current

      if (expanded) {
        setOverlayExitPending(false)
        setOverlayMotionOpen(false)
        const id = requestAnimationFrame(() => {
          requestAnimationFrame(() => setOverlayMotionOpen(true))
        })
        prevExpandedRef.current = expanded
        return () => cancelAnimationFrame(id)
      }

      if (prev && !expanded) {
        setOverlayMotionOpen(false)
        setOverlayExitPending(true)
      }
      prevExpandedRef.current = expanded
    }, [expanded, isOverlay])

    React.useEffect(() => {
      if (!overlayExitPending || overlayMotionOpen) return
      const ms = 280
      const t = window.setTimeout(() => setOverlayExitPending(false), ms)
      return () => window.clearTimeout(t)
    }, [overlayExitPending, overlayMotionOpen])

    const handleOverlayTransitionEnd = React.useCallback(
      (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return
        if (e.propertyName !== "opacity") return
        if (!expanded) {
          setOverlayExitPending(false)
        }
      },
      [expanded],
    )

    React.useEffect(() => {
      if (!isOverlay || !expanded) return
      const onDocPointerDown = (e: PointerEvent) => {
        const t = e.target
        if (!(t instanceof Node)) return
        if (triggerElRef.current?.contains(t)) return
        if (overlayPanelRef.current?.contains(t)) return
        onOverlayDismiss?.()
      }
      document.addEventListener("pointerdown", onDocPointerDown, true)
      return () =>
        document.removeEventListener("pointerdown", onDocPointerDown, true)
    }, [expanded, isOverlay, onOverlayDismiss])

    React.useEffect(() => {
      if (!isOverlay || !expanded) return
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.stopPropagation()
          onOverlayDismiss?.()
        }
      }
      window.addEventListener("keydown", onKey, true)
      return () => window.removeEventListener("keydown", onKey, true)
    }, [expanded, isOverlay, onOverlayDismiss])

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
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        setKeyboardFocusRing(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    const overlayPortal =
      isOverlay &&
      overlayActive &&
      typeof document !== "undefined" &&
      overlayBox &&
      createPortal(
        <div
          ref={overlayPanelRef}
          className="ds-dropdown__menuOverlay"
          data-overlay-open={overlayMotionOpen ? "true" : "false"}
          style={{
            top: overlayBox.top,
            left: overlayBox.left,
            width: overlayBox.width,
            maxHeight: overlayBox.maxHeight,
          }}
          onTransitionEnd={handleOverlayTransitionEnd}
        >
          <div className="ds-dropdown__menuOverlayInner" id={overlayListId}>
            {panelSlot === undefined ? (
              <DropdownPanelSlotPlaceholder />
            ) : (
              panelSlot
            )}
          </div>
        </div>,
        document.body,
      )

    return (
      <div
        className={cn("ds-dropdown", className)}
        data-component="dropdown"
        data-variant={isOverlay ? "overlay" : undefined}
        data-expanded={expanded ? "true" : undefined}
        data-full-width={fullWidth ? "true" : undefined}
        onTransitionEnd={isOverlay ? undefined : onTransitionEnd}
      >
        <button
          ref={setTriggerRef}
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
          aria-controls={isOverlay && expanded ? overlayListId : undefined}
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
        {!isOverlay && panelSlot !== null ? (
          <span
            className="ds-dropdown__menu"
            data-part="menu"
            aria-hidden={expanded ? undefined : true}
          >
            <span className="ds-dropdown__menuMotion">
              {panelSlot === undefined ? (
                <DropdownPanelSlotPlaceholder />
              ) : (
                panelSlot
              )}
            </span>
          </span>
        ) : null}
        {overlayPortal}
      </div>
    )
  },
)

export {
  DropdownMenu,
  DropdownMenuDivider,
  dropdownMenuOptionClassName,
} from "./dropdown-menu"
export type {
  DropdownMenuProps,
  DropdownMenuDividerProps,
} from "./dropdown-menu"
export { DropdownOption } from "./dropdown-option"
export type { DropdownOptionProps } from "./dropdown-option"
