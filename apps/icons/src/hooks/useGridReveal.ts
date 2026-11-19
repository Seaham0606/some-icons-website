import gsap from 'gsap'
import { EASE_OUT, MOTION_S } from '@/lib/motion'
import { useLayoutEffect, type RefObject } from 'react'

/** Only the first cards are animated; the rest are off-screen or too many to tween cheaply. */
const MAX_ANIMATED_CARDS = 60

/**
 * Light staggered fade-up for grid cards. Plays when `revealKey` changes (e.g. category or style)
 * and when the grid first has something to show. Skipped under `prefers-reduced-motion`.
 */
export function useGridReveal(
  gridRef: RefObject<HTMLElement | null>,
  revealKey: string,
  ready: boolean,
) {
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!ready || !grid) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = Array.from(grid.children).slice(0, MAX_ANIMATED_CARDS)
    if (cards.length === 0) return

    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: MOTION_S.base,
        ease: EASE_OUT,
        stagger: 0.008,
        clearProps: 'opacity,transform',
      },
    )
    return () => {
      tween.kill()
      gsap.set(cards, { clearProps: 'opacity,transform' })
    }
  }, [gridRef, revealKey, ready])
}
