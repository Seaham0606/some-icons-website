import { IconPreview } from '@/components/icons/IconPreview'
import { cn } from '@/lib/utils'
import { useFilterStore } from '@/stores/filterStore'
import type { Icon } from '@/types/icon'
import gsap from 'gsap'
import { useLayoutEffect, useMemo, useRef, type Ref } from 'react'

const MAX_STACK_ICONS = 5

/**
 * Per-depth visual config for behind cards.
 * depth 1 = nearest behind front (second newest selected)
 * depth 4 = furthest behind (oldest selected, when 5 icons in stack)
 */
const STACK_CONFIGS = [
  { scale: 0.9,  ty: 16, blur: 1,   opacity: 0.8  },
  { scale: 0.8,  ty: 32, blur: 2.5, opacity: 0.6  },
  { scale: 0.7,  ty: 48, blur: 4,   opacity: 0.42 },
  { scale: 0.6,  ty: 64, blur: 5.5, opacity: 0.28 },
] as const

type StackVisual = {
  scale: number
  ty: number
  blur: number
  opacity: number
}

const STACK_TWEEN_DURATION_S = 0.48
const STACK_TWEEN_EASE = 'power3.out'

/** Slot width as % of the wireframe when showing a lone icon over the grid. */
export const SINGLE_STACK_SLOT_PERCENT = (16 / 24) * 100

/** Fixed slot pixel size for the multi-select stack. */
export const MULTI_STACK_SLOT_PX = 160

function stackVisualForDepth(depthFromFront: number): StackVisual | null {
  if (depthFromFront === 0) return null
  return STACK_CONFIGS[depthFromFront - 1] ?? STACK_CONFIGS[STACK_CONFIGS.length - 1]
}

/**
 * Maps a behind-card's array index to its visual depth.
 * behindIcons[0] = oldest selected → deepest (largest depth number)
 * behindIcons[behindCount-1] = second newest → nearest behind front (depth 1)
 */
function depthFromFrontForBehindIndex(behindIndex: number, behindCount: number): number {
  return behindCount - behindIndex
}

function applyCardDepthPose(el: HTMLElement, depthFromFront: number) {
  const visual = stackVisualForDepth(depthFromFront)
  if (visual == null) {
    gsap.set(el, { clearProps: 'y,scale,opacity,filter' })
    return
  }
  gsap.set(el, {
    y: visual.ty,
    scale: visual.scale,
    opacity: visual.opacity,
    filter: `blur(${visual.blur}px)`,
  })
}

export interface IconStackProps {
  icons: Icon[]
  color?: string
  className?: string
  /** Ref to the centered slot wrapper (used for single ↔ multi size tween). */
  slotRef?: Ref<HTMLDivElement>
  /** Ref to the front-most stack card (used for chrome reveal/hide tween). */
  frontCardRef?: Ref<HTMLDivElement>
  /**
   * When set, constrains the slot to this pixel size (single-icon export preview).
   */
  displaySize?: number
}

/**
 * Stack preview layer. The MOST RECENTLY selected icon (last in `icons`) is always
 * the front card. Older selections stack behind — newest-behind nearest the front,
 * oldest-behind at the back. Shows at most MAX_STACK_ICONS (5) at once.
 *
 * Stacking order mirrors the code/snippet section in reverse:
 *   code list: [A (oldest), B, C, D (newest)]
 *   visual (top→bottom): D (front), C, B, A
 */
export function IconStack({
  icons,
  color,
  className,
  slotRef,
  frontCardRef,
  displaySize,
}: IconStackProps) {
  const style = useFilterStore((s) => s.style)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const prevIconIdsRef = useRef<string[]>([])
  const prevFrontIdRef = useRef<string | null>(null)

  const { frontIcon, behindIcons, displayIcons } = useMemo(() => {
    // Show the most recent MAX_STACK_ICONS selections
    const capped = icons.slice(-MAX_STACK_ICONS)
    if (capped.length === 0) {
      return { frontIcon: null, behindIcons: [] as Icon[], displayIcons: [] as Icon[] }
    }
    // Most recently selected = last in array = visual front/top
    const front = capped[capped.length - 1]
    // Older icons: oldest at index 0 (deepest), newest-behind at last index (depth 1)
    const behind = capped.slice(0, -1)
    return { frontIcon: front, behindIcons: behind, displayIcons: capped }
  }, [icons])

  useLayoutEffect(() => {
    const currentIds = displayIcons.map((ic) => ic.id)
    const prevIds = prevIconIdsRef.current
    const isInitialMount = prevIds.length === 0

    const addedIds = currentIds.filter((id) => !prevIds.includes(id))
    const removedIds = prevIds.filter((id) => !currentIds.includes(id))

    const prevFrontId = prevFrontIdRef.current
    prevIconIdsRef.current = currentIds
    prevFrontIdRef.current = frontIcon?.id ?? null

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Clean up refs for removed cards
    for (const id of removedIds) {
      const el = cardRefs.current.get(id)
      if (el != null) gsap.killTweensOf(el)
      cardRefs.current.delete(id)
    }

    // When the previous front card is now a behind card, its GSAP-set
    // --stack-card-chrome (from single-mode applyStackMode) may be 0.
    // Clear it so CSS takes over (behind cards default to chrome=1).
    if (
      prevFrontId != null &&
      prevFrontId !== (frontIcon?.id ?? null) &&
      behindIcons.some((ic) => ic.id === prevFrontId)
    ) {
      const prevFrontEl = cardRefs.current.get(prevFrontId)
      if (prevFrontEl != null) {
        gsap.set(prevFrontEl, { clearProps: '--stack-card-chrome' })
      }
    }

    const behindCount = behindIcons.length

    if (isInitialMount) {
      // Snap all cards to their correct poses without animation
      for (let i = 0; i < behindIcons.length; i++) {
        const el = cardRefs.current.get(behindIcons[i].id)
        if (el == null) continue
        applyCardDepthPose(el, depthFromFrontForBehindIndex(i, behindCount))
      }
      if (frontIcon != null) {
        const frontEl = cardRefs.current.get(frontIcon.id)
        if (frontEl != null) gsap.set(frontEl, { clearProps: 'y,scale,opacity,filter' })
      }
      return
    }

    // ── Animate behind cards to their new depth positions ──
    for (let i = 0; i < behindIcons.length; i++) {
      const behindIcon = behindIcons[i]
      const el = cardRefs.current.get(behindIcon.id)
      if (el == null) continue

      const depth = depthFromFrontForBehindIndex(i, behindCount)

      if (reducedMotion) {
        applyCardDepthPose(el, depth)
        continue
      }

      const visual = stackVisualForDepth(depth)
      gsap.killTweensOf(el)
      gsap.to(el, {
        y: visual?.ty ?? 0,
        scale: visual?.scale ?? 1,
        opacity: visual?.opacity ?? 1,
        filter: `blur(${visual?.blur ?? 0}px)`,
        duration: STACK_TWEEN_DURATION_S,
        ease: STACK_TWEEN_EASE,
        overwrite: true,
      })
    }

    // ── Front card ──
    if (frontIcon == null) return
    const frontEl = cardRefs.current.get(frontIcon.id)
    if (frontEl == null) return

    const isNewFront = addedIds.includes(frontIcon.id)

    if (reducedMotion) {
      gsap.set(frontEl, { clearProps: 'y,scale,opacity,filter' })
      return
    }

    if (isNewFront) {
      // Brand-new icon selected — slide in from slightly above
      gsap.fromTo(
        frontEl,
        { y: -14, opacity: 0, scale: 0.96, filter: 'blur(0px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: STACK_TWEEN_DURATION_S,
          ease: STACK_TWEEN_EASE,
          overwrite: true,
        },
      )
    } else if (removedIds.length > 0) {
      // An icon was removed; this existing icon is now (or remains) the visual front
      gsap.killTweensOf(frontEl)
      gsap.to(frontEl, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: STACK_TWEEN_DURATION_S,
        ease: STACK_TWEEN_EASE,
        overwrite: true,
      })
    }
  }, [displayIcons, behindIcons, frontIcon])

  const slotSizeStyle =
    displaySize != null
      ? { width: Math.min(displaySize, 200), height: Math.min(displaySize, 200) }
      : undefined

  if (frontIcon == null) return null

  return (
    <div className={cn('homepage-iconStack', className)}>
      <div ref={slotRef} className="homepage-iconStack__slot" style={slotSizeStyle}>
        {behindIcons.map((icon) => (
          <div
            key={icon.id}
            ref={(el) => {
              if (el != null) cardRefs.current.set(icon.id, el)
              else cardRefs.current.delete(icon.id)
            }}
            className="homepage-iconStack__card"
          >
            <IconPreview
              path={icon.files[style]}
              tintColor={color}
              className="homepage-iconStack__icon"
            />
          </div>
        ))}

        <div
          key={frontIcon.id}
          ref={(el) => {
            if (frontCardRef != null) {
              if (typeof frontCardRef === 'function') frontCardRef(el)
              else frontCardRef.current = el
            }
            if (el != null) cardRefs.current.set(frontIcon.id, el)
            else cardRefs.current.delete(frontIcon.id)
          }}
          className={cn('homepage-iconStack__card', 'homepage-iconStack__card--front')}
        >
          <IconPreview
            path={frontIcon.files[style]}
            tintColor={color}
            className="homepage-iconStack__icon"
          />
        </div>
      </div>
    </div>
  )
}
