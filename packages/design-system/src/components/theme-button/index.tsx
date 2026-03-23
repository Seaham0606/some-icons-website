"use client"

import { useEffect, useRef, useState } from "react"
import { Button, type ButtonRadius } from "../button"
import { cn } from "../../utils"
import { SomeIcon } from "../some-icon"

export interface ThemeButtonProps {
  /**
   * Effective color appearance from the app (e.g. store + system resolution).
   * Moon when `light`, sun when `dark`.
   */
  mode: "light" | "dark"
  /** Parent updates persisted theme (e.g. flip between light and dark). */
  onToggle: () => void
  className?: string
  /** Passed to the underlying `Button`; controls clip shape for the icon strip. */
  radius?: ButtonRadius
  disabled?: boolean
  cdnBaseUrl?: string
}

/**
 * Strip order: moon → sun → moon. Each toggle scrolls the track up one cell;
 * after light mode we snap from the third cell back to the first (same moon) with no motion.
 */
export function ThemeButton({
  mode,
  onToggle,
  className,
  radius = "lg",
  disabled,
  cdnBaseUrl,
}: ThemeButtonProps) {
  const isDark = mode === "dark"
  const prevModeRef = useRef(mode)
  const stepRef = useRef(0)
  const [step, setStep] = useState(() => (mode === "dark" ? 1 : 0))
  stepRef.current = step
  /** When true, transform jumps without transition (infinite-strip reset). */
  const [instant, setInstant] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setInstant(false)
      setStep(mode === "dark" ? 1 : 0)
      prevModeRef.current = mode
      return
    }

    const prev = prevModeRef.current
    if (prev === mode) return

    if (prev === "light" && mode === "dark") {
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
    } else if (prev === "dark" && mode === "light") {
      setInstant(false)
      setStep(2)
    }
    prevModeRef.current = mode
  }, [mode, reduceMotion])

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
    transform: `translateY(calc(-1 * ${step} * var(--ds-theme-button-row)))`,
    transition: instant ? "none" : undefined,
  }

  const iconStack = (
    <div className="ds-theme-button__viewport">
      <div
        className="ds-theme-button__track"
        style={trackStyle}
        onTransitionEnd={handleTrackTransitionEnd}
      >
        <div className="ds-theme-button__cell">
          <SomeIcon
            iconName="weather-moon"
            iconStyle="fill"
            cdnBaseUrl={cdnBaseUrl}
          />
        </div>
        <div className="ds-theme-button__cell">
          <SomeIcon
            iconName="weather-sun"
            iconStyle="outline"
            cdnBaseUrl={cdnBaseUrl}
          />
        </div>
        <div className="ds-theme-button__cell">
          <SomeIcon
            iconName="weather-moon"
            iconStyle="fill"
            cdnBaseUrl={cdnBaseUrl}
          />
        </div>
      </div>
    </div>
  )

  return (
    <Button
      type="button"
      variant="transparent"
      size="md"
      radius={radius}
      className={cn("ds-theme-button", className)}
      disabled={disabled}
      cdnBaseUrl={cdnBaseUrl}
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      leadingSlot={iconStack}
      contentColor="var(--color-main-tertiary)"
    />
  )
}
