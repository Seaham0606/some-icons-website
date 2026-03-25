"use client"

import * as React from "react"
import { cn } from "../../utils"
import { SomeIcon } from "../some-icon"
import type { SomeIconIconSize, SomeIconPadding, SomeIconStyle } from "../some-icon"

export type ButtonRadius =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full"

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "transparent"

export interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "type" | "disabled"
  > {
  className?: string
  variant?: ButtonVariant
  /** Figma only defines inverse for `primary`; other variants use `default`. */
  tint?: "default" | "inverse"
  size?: "lg" | "md" | "sm"
  radius?: ButtonRadius
  /** When true, spans the full width of the container (default sizes to content via `inline-flex`). */
  fullWidth?: boolean
  disabled?: boolean
  /** When set, tints label text and icon slots (`currentColor` SVGs). */
  contentColor?: React.CSSProperties["color"]
  /** Label text; omit for icon-only buttons (use `aria-label`). */
  children?: React.ReactNode
  /** Renders the leading icon area when provided. */
  leadingSlot?: React.ReactNode
  /** Renders the trailing icon area when provided. */
  trailingSlot?: React.ReactNode
  /**
   * Renders `SomeIcon` on the start or end side (see `iconPlacement`).
   * Prefer this over passing `SomeIcon` in slots when using Vite `optimizeDeps` on `design-system`,
   * so the icon isn’t dropped from the props object.
   */
  iconName?: string
  iconStyle?: SomeIconStyle
  iconPlacement?: "start" | "end"
  cdnBaseUrl?: string
  href?: string
  type?: "button" | "submit" | "reset"
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  download?: string | boolean
}

export function Button(props: ButtonProps) {
  const {
    className,
    variant = "primary",
    tint = "default",
    size = "lg",
    radius = "md",
    fullWidth = false,
    disabled = false,
    contentColor,
    children,
    leadingSlot,
    trailingSlot,
    iconName,
    iconStyle = "outline",
    iconPlacement = "start",
    cdnBaseUrl,
    href,
    type = "button",
    target,
    rel,
    download,
    onClick,
    tabIndex,
    ...rest
  } = props

  const resolvedTint = variant === "primary" ? tint : "default"

  const contentColorStyle: React.CSSProperties | undefined =
    contentColor !== undefined && contentColor !== null
      ? { color: contentColor }
      : undefined

  const someIconLayout: { iconSize: SomeIconIconSize; padding: SomeIconPadding } =
    size === "sm"
      ? { iconSize: "xs", padding: "1" }
      : { iconSize: "sm", padding: "050" }

  const trimmedIconName = iconName?.trim() ?? ""
  const hasIconName = trimmedIconName.length > 0
  const cdnIcon = hasIconName ? (
    <SomeIcon
      iconName={trimmedIconName}
      iconStyle={iconStyle}
      cdnBaseUrl={cdnBaseUrl}
      iconSize={someIconLayout.iconSize}
      padding={someIconLayout.padding}
    />
  ) : null

  const leadContent =
    leadingSlot ??
    (hasIconName && iconPlacement !== "end" ? cdnIcon : null)
  const trailContent =
    trailingSlot ?? (hasIconName && iconPlacement === "end" ? cdnIcon : null)

  const showLeading = leadContent != null
  const showTrailing = trailContent != null
  const showLabel = children != null

  const common = {
    className: cn("ds-button", className),
    "data-variant": variant,
    "data-tint": resolvedTint,
    "data-size": size,
    "data-radius": radius,
    ...(fullWidth ? { "data-full-width": "true" as const } : {}),
    ...(!showLabel ? { "data-icon-only": "true" as const } : {}),
  } as const

  const body = (
    <>
      {showLeading ? (
        <span
          className="ds-button__iconSlot"
          style={contentColorStyle}
          data-part="leading-slot"
        >
          <span className="ds-button__icon" aria-hidden>
            {leadContent}
          </span>
        </span>
      ) : null}
      {showLabel ? (
        <span
          className="ds-button__labelWrap"
          style={contentColorStyle}
          data-part="label"
        >
          <span className="ds-button__label">{children}</span>
        </span>
      ) : null}
      {showTrailing ? (
        <span
          className="ds-button__iconSlot"
          style={contentColorStyle}
          data-part="trailing-slot"
        >
          <span className="ds-button__icon" aria-hidden>
            {trailContent}
          </span>
        </span>
      ) : null}
    </>
  )

  if (href !== undefined && href !== "") {
    const handleAnchorClick: React.MouseEventHandler<HTMLAnchorElement> = (
      e,
    ) => {
      if (disabled) {
        e.preventDefault()
        return
      }
      onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>)
    }

    return (
      <a
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        {...common}
        href={href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        target={target}
        rel={rel}
        download={download}
        onClick={handleAnchorClick}
      >
        {body}
      </a>
    )
  }

  return (
    <button
      {...rest}
      {...common}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {body}
    </button>
  )
}
