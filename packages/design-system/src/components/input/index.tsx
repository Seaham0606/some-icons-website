"use client"

import * as React from "react"
import { cn } from "../../utils"

export type InputStatus = "default" | "success" | "warning" | "error"

/** Class for styled native `<input>` / `<button>` fields (see `.ds-nativeInput` in `components.css`). */
export const nativeInputClassName = "ds-nativeInput" as const

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "size"> {
  className?: string
  /** Classes on the native `<input>`. */
  inputClassName?: string
  /** Validation / intent chrome (also set when `aria-invalid` is true → `error`). */
  status?: InputStatus
  /**
   * Sets value/placeholder text and leading/trailing slot color (`currentColor` for icons).
   * When omitted, defaults follow status, filled, and disabled rules.
   */
  contentColor?: React.CSSProperties["color"]
  showLeading?: boolean
  showTrailing?: boolean
  /** For CDN icons, prefer `<SomeIcon iconName="…" iconSize="md" padding="2" />` for 40×40 input slots. */
  leadingSlot?: React.ReactNode
  trailingSlot?: React.ReactNode
}

/** Figma SlotPlaceholder inside a leading/trailing slot (40×40). */
export function InputSlotPlaceholder() {
  return (
    <div
      className="ds-input__slotPlaceholder"
      data-part="slot-placeholder"
      aria-hidden
    />
  )
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      inputClassName,
      status: statusProp = "default",
      contentColor,
      showLeading,
      showTrailing,
      leadingSlot,
      trailingSlot,
      disabled,
      readOnly,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref
  ) {
    const status: InputStatus =
      ariaInvalid === true || ariaInvalid === "true"
        ? "error"
        : statusProp

    const controlled = value !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      String(defaultValue ?? "")
    )

    React.useEffect(() => {
      if (controlled) return
      setUncontrolledValue(String(defaultValue ?? ""))
    }, [controlled, defaultValue])

    const filled = controlled
      ? String(value ?? "").length > 0
      : uncontrolledValue.length > 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!controlled) setUncontrolledValue(e.target.value)
      onChange?.(e)
    }

    const showLead = showLeading ?? leadingSlot != null
    const showTrail = showTrailing ?? trailingSlot != null

    const borderless = Boolean(disabled || readOnly)

    const shellStyle: React.CSSProperties | undefined =
      contentColor !== undefined && contentColor !== null
        ? ({ ["--ds-input-content-color"]: contentColor } as React.CSSProperties)
        : undefined

    /**
     * Time of last pointer down in the shell. Click-to-focus almost always fires focus within
     * a few ms; a dead click on the chrome leaves a stale timestamp that falls outside this
     * window before Tab, so the ring still appears for keyboard focus.
     */
    const lastPointerDownInShellRef = React.useRef(0)
    /** Keyboard-style focus ring (Tab); suppressed after pointer-originated focus until blur. */
    const [keyboardFocusRing, setKeyboardFocusRing] = React.useState(false)

    const handlePointerDownCapture = React.useCallback(() => {
      lastPointerDownInShellRef.current = performance.now()
    }, [])

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        const dt = performance.now() - lastPointerDownInShellRef.current
        const fromPointerClick = dt >= 0 && dt < 120
        lastPointerDownInShellRef.current = 0

        if (fromPointerClick) {
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
      (e: React.FocusEvent<HTMLInputElement>) => {
        setKeyboardFocusRing(false)
        onBlur?.(e)
      },
      [onBlur]
    )

    return (
      <div
        className={cn("ds-input", className)}
        style={shellStyle}
        data-component="input"
        data-status={status}
        data-filled={filled ? "true" : "false"}
        data-disabled={disabled ? "true" : undefined}
        data-readonly={readOnly ? "true" : undefined}
        data-frame={borderless ? "borderless" : undefined}
        data-has-leading={showLead ? "true" : undefined}
        data-has-trailing={showTrail ? "true" : undefined}
        data-focus-ring={keyboardFocusRing ? "true" : undefined}
        onPointerDownCapture={handlePointerDownCapture}
      >
        {showLead ? (
          <div className="ds-input__slot" data-part="leading">
            {leadingSlot ?? <InputSlotPlaceholder />}
          </div>
        ) : null}
        <div className="ds-input__field" data-part="field">
          <input
            ref={ref}
            className={cn("ds-input__input", inputClassName)}
            data-part="control"
            {...rest}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={ariaInvalid}
            {...(controlled
              ? { value: value ?? "" }
              : { defaultValue: defaultValue ?? "" })}
          />
        </div>
        {showTrail ? (
          <div className="ds-input__slot" data-part="trailing">
            {trailingSlot ?? <InputSlotPlaceholder />}
          </div>
        ) : null}
      </div>
    )
  }
)
