import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* Backdrop open/close is tied to CSS opacity transitions; layout effect keeps `mounted` true through the close animation without a paint where the overlay is gone while the header panel is still collapsing. */
/* eslint-disable react-hooks/set-state-in-effect -- intentional synchronous phase updates for transition parity */

/** Matches design-system dropdown / SiteHeader panel motion. */
export const APP_BACKDROP_TRANSITION_MS = 360

/**
 * Drives opacity transition for a full-screen backdrop: `mounted` stays true briefly after `open`
 * becomes false so `opacity` can animate out (mirrors collapsible panel close).
 */
export function useBackdropPresence(
  open: boolean,
  durationMs = APP_BACKDROP_TRANSITION_MS,
): { mounted: boolean; visible: boolean } {
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(false)
  const prevOpenRef = useRef(open)

  const mounted = open || leaving

  useLayoutEffect(() => {
    if (open) {
      setLeaving(false)
      prevOpenRef.current = true
      return
    }
    if (prevOpenRef.current) {
      setVisible(false)
      setLeaving(true)
    }
    prevOpenRef.current = false
  }, [open])

  useEffect(() => {
    if (!open) return
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [open])

  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => setLeaving(false), durationMs)
    return () => clearTimeout(t)
  }, [leaving, durationMs])

  return { mounted, visible }
}
