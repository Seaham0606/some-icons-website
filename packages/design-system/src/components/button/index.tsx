"use client"

import * as React from "react"
import gsap from "gsap"
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

/** Matches the app motion scale (`MOTION_S.slow`, `EASE_OUT`). */
const STRIP_TWEEN_DURATION_S = 0.4
const STRIP_TWEEN_EASE = "power3.out"

function getStripRowPx(track: HTMLDivElement): number {
  const cell = track.querySelector(":scope > .ds-button-icon-strip__cell")
  if (!cell) return 0
  const style = getComputedStyle(track)
  const gapRaw = parseFloat(style.rowGap || style.gap || "0")
  const gap = Number.isFinite(gapRaw) ? gapRaw : 0
  return cell.getBoundingClientRect().height + gap
}

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
  const trackRef = React.useRef<HTMLDivElement>(null)
  const prevIndexRef = React.useRef<0 | 1 | null>(null)
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

  // The track holds three rows (A, B, A). Going A→B scrolls to row 1; B→A keeps scrolling forward
  // to the trailing A row, then snaps back to row 0 (same picture, so the loop is seamless).
  // All state lives in the GSAP tween, so interrupting mid-way just continues from the current y.
  React.useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const row = getStripRowPx(track)
    const rowY = (index: number) => (row > 0 ? -index * row : 0)
    const prev = prevIndexRef.current
    prevIndexRef.current = activeIndex

    const currentY = Number(gsap.getProperty(track, "y")) || 0
    gsap.killTweensOf(track)

    if (snap || prev === null || prev === activeIndex) {
      gsap.set(track, { y: rowY(activeIndex) })
      return () => {
        gsap.killTweensOf(track)
      }
    }

    // Heading to A: reverse in place if B hasn't been reached yet, otherwise wrap forward.
    const wrapsForward = activeIndex === 0 && currentY <= rowY(1) + 0.5
    const targetY =
      activeIndex === 1 ? rowY(1) : wrapsForward ? rowY(2) : rowY(0)

    gsap.to(track, {
      y: targetY,
      duration: STRIP_TWEEN_DURATION_S,
      ease: STRIP_TWEEN_EASE,
      onComplete: () => {
        if (wrapsForward) gsap.set(track, { y: 0 })
      },
    })

    return () => {
      gsap.killTweensOf(track)
    }
  }, [activeIndex, snap])

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
      <div ref={trackRef} className="ds-button-icon-strip__track">
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
