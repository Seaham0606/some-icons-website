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

/** Entry in `stateIcons` for the two-state CDN icon strip. */
export interface ButtonStateIcon {
  iconName: string
  iconStyle?: SomeIconStyle
  /** Passed to `SomeIcon` (e.g. `var(--color-intent-success)` for a success glyph). */
  color?: React.CSSProperties["color"]
}

type ButtonStripPlacement = "start" | "end"

function ButtonAnimatedStrip({
  stateIcons,
  activeIndex,
  hasFeedback = true,
  respectReducedMotion = true,
  cdnBaseUrl,
  iconSize = "md",
  className,
}: {
  stateIcons: [ButtonStateIcon, ButtonStateIcon]
  activeIndex: 0 | 1
  hasFeedback?: boolean
  respectReducedMotion?: boolean
  cdnBaseUrl?: string
  iconSize?: SomeIconIconSize
  className?: string
}) {
  const [a, b] = stateIcons
  const prevIndexRef = React.useRef(activeIndex)
  const stepRef = React.useRef(0)
  const [step, setStep] = React.useState(() => (activeIndex === 1 ? 1 : 0))
  stepRef.current = step
  const [instant, setInstant] = React.useState(false)
  const [systemReduceMotion, setSystemReduceMotion] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setSystemReduceMotion(mq.matches)
    const onChange = () => setSystemReduceMotion(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const snap =
    !hasFeedback || (respectReducedMotion && systemReduceMotion)

  React.useEffect(() => {
    if (snap) {
      setInstant(false)
      setStep(activeIndex === 1 ? 1 : 0)
      prevIndexRef.current = activeIndex
      return
    }

    const prev = prevIndexRef.current
    if (prev === activeIndex) return

    if (prev === 0 && activeIndex === 1) {
      if (stepRef.current === 2) {
        setInstant(true)
        setStep(0)
        requestAnimationFrame(() => {
          setInstant(false)
          setStep(1)
        })
      } else {
        setInstant(false)
        setStep(1)
      }
    } else if (prev === 1 && activeIndex === 0) {
      setInstant(false)
      setStep(2)
    }
    prevIndexRef.current = activeIndex
  }, [activeIndex, snap])

  const handleTrackTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (e.propertyName !== "transform" || e.target !== e.currentTarget) return
    if (step !== 2) return

    setInstant(true)
    setStep(0)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setInstant(false)
      })
    })
  }

  const trackStyle: React.CSSProperties = {
    transform: `translateY(calc(-1 * ${step} * var(--ds-button-icon-strip-row)))`,
    transition: instant ? "none" : undefined,
  }

  const cell = (spec: ButtonStateIcon, key: string) => (
    <div className="ds-button-icon-strip__cell" key={key}>
      <SomeIcon
        iconName={spec.iconName}
        iconStyle={spec.iconStyle ?? "outline"}
        cdnBaseUrl={cdnBaseUrl}
        iconSize={iconSize}
        color={spec.color}
      />
    </div>
  )

  return (
    <div className={cn("ds-button-icon-strip__viewport", className)}>
      <div
        className="ds-button-icon-strip__track"
        style={trackStyle}
        onTransitionEnd={handleTrackTransitionEnd}
      >
        {cell(a, "a")}
        {cell(b, "b")}
        {cell(a, "a-end")}
      </div>
    </div>
  )
}

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
  /**
   * Two-state animated CDN icon strip (A→B→A). When set, adds `ds-button-icon-strip` and renders
   * the strip on the side given by `stripPlacement`. Overrides `leadingSlot` / `trailingSlot` /
   * `iconName` on that side only.
   */
  stateIcons?: [ButtonStateIcon, ButtonStateIcon]
  /** Settled strip index when `stateIcons` is set. @default 0 */
  stripActiveIndex?: 0 | 1
  /** Which slot receives `stateIcons`. @default "start" */
  stripPlacement?: ButtonStripPlacement
  /**
   * When false, the icon strip snaps without scroll animation. Only applies when `stateIcons` is set.
   * @default true
   */
  hasFeedback?: boolean
  /**
   * When true (default), `prefers-reduced-motion: reduce` disables strip motion. Only applies when `stateIcons` is set.
   * @default true
   */
  respectReducedMotion?: boolean
  /** Glyph size for strip `SomeIcon`s when `stateIcons` is set. @default "md" */
  stripIconSize?: SomeIconIconSize
  /**
   * When `stateIcons` is set and `stripActiveIndex` is `1`, applied as `backgroundColor` on the button
   * (e.g. `var(--color-overlay-success)`).
   */
  stripActiveBackground?: React.CSSProperties["backgroundColor"]
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
    stateIcons,
    stripActiveIndex = 0,
    stripPlacement = "start",
    hasFeedback = true,
    respectReducedMotion = true,
    stripIconSize = "md",
    style,
    stripActiveBackground,
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

  const stripOnStart = stateIcons != null && stripPlacement === "start"
  const stripOnEnd = stateIcons != null && stripPlacement === "end"

  const stripNode =
    stateIcons != null ? (
      <ButtonAnimatedStrip
        stateIcons={stateIcons}
        activeIndex={stripActiveIndex}
        hasFeedback={hasFeedback}
        respectReducedMotion={respectReducedMotion}
        cdnBaseUrl={cdnBaseUrl}
        iconSize={stripIconSize}
      />
    ) : null

  const leadContent = stripOnStart
    ? stripNode
    : leadingSlot ??
      (hasIconName && iconPlacement !== "end" ? cdnIcon : null)
  const trailContent = stripOnEnd
    ? stripNode
    : trailingSlot ?? (hasIconName && iconPlacement === "end" ? cdnIcon : null)

  const showLeading = leadContent != null
  const showTrailing = trailContent != null
  const showLabel = children != null

  const stripShowsSecondState =
    stateIcons != null && stripActiveIndex === 1 && stripActiveBackground != null

  const mergedStyle: React.CSSProperties | undefined =
    style != null || stripShowsSecondState
      ? {
          ...style,
          ...(stripShowsSecondState
            ? { backgroundColor: stripActiveBackground }
            : {}),
        }
      : undefined

  const common = {
    className: cn(
      "ds-button",
      stateIcons != null && "ds-button-icon-strip",
      className,
    ),
    "data-variant": variant,
    "data-tint": resolvedTint,
    "data-size": size,
    "data-radius": radius,
    ...(fullWidth ? { "data-full-width": "true" as const } : {}),
    ...(!showLabel ? { "data-icon-only": "true" as const } : {}),
    ...(mergedStyle != null ? { style: mergedStyle } : {}),
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
