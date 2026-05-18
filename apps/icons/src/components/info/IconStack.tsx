import { IconPreview } from '@/components/icons/IconPreview'
import { cn } from '@/lib/utils'
import { useFilterStore } from '@/stores/filterStore'
import type { Icon } from '@/types/icon'
import gsap from 'gsap'
import { useLayoutEffect, useMemo, useRef, type Ref } from 'react'

const MAX_STACK_ICONS = 5

/** Per-depth config for stacked cards behind the front card (depth 1 = nearest behind front). */
const STACK_CONFIGS = [
  { scale: 0.9, ty: 16, blur: 1, opacity: 0.88 },
  { scale: 0.8, ty: 32, blur: 2, opacity: 0.75 },
  { scale: 0.7, ty: 48, blur: 3, opacity: 0.63 },
  { scale: 0.6, ty: 64, blur: 4, opacity: 0.5 },
] as const

type StackVisual = {
  scale: number
  ty: number
  blur: number
  opacity: number
}

/** Resting pose tucked behind the front card before sliding into stack depth. */
const ENTRY_BEHIND_TOP: StackVisual = {
  scale: 0.94,
  ty: 0,
  blur: 0,
  opacity: 0.92,
}

const STACK_TWEEN_DURATION_S = 0.48
const STACK_TWEEN_EASE = 'power3.out'

/** Slot width as % of the wireframe when showing a lone icon over the grid. */
export const SINGLE_STACK_SLOT_PERCENT = (16 / 24) * 100

/** Slot width as % of the wireframe in multi-select stack mode. */
export const MULTI_STACK_SLOT_PERCENT = 50

function stackVisualForDepth(depthFromFront: number): StackVisual | null {
  if (depthFromFront === 0) return null
  return STACK_CONFIGS[depthFromFront - 1] ?? STACK_CONFIGS[STACK_CONFIGS.length - 1]
}

function cardTransformStyle(visual: StackVisual | null) {
  if (visual == null) return undefined
  return {
    transform: `translateY(${visual.ty}px) scale(${visual.scale})`,
    filter: `blur(${visual.blur}px)`,
    opacity: visual.opacity,
  } as const
}

/**
 * Maps behind-card index to stack depth using code/snippet order:
 * 2nd in list (index 0) = furthest back; last in list = nearest behind the front card.
 */
function depthFromFrontForBehindIndex(
  behindIndex: number,
  behindCount: number,
): number {
  return behindCount - behindIndex
}

function applyCardDepthPose(el: HTMLElement, depthFromFront: number) {
  const visual = stackVisualForDepth(depthFromFront)
  if (visual == null) {
    gsap.set(el, { clearProps: 'transform,filter,opacity' })
    return
  }
  gsap.set(el, {
    y: visual.ty,
    scale: visual.scale,
    opacity: visual.opacity,
    filter: `blur(${visual.blur}px)`,
  })
}

function animateCardToDepth(
  el: HTMLElement,
  depthFromFront: number,
  reducedMotion: boolean,
  delay = 0,
) {
  const finalVisual = stackVisualForDepth(depthFromFront)
  const fromVisual =
    depthFromFront === 0 ? ENTRY_BEHIND_TOP : STACK_CONFIGS[0]

  gsap.killTweensOf(el)

  if (reducedMotion) {
    const run = () => applyCardDepthPose(el, depthFromFront)
    if (delay > 0) {
      gsap.delayedCall(delay, run)
    } else {
      run()
    }
    return
  }

  gsap.set(el, {
    y: fromVisual.ty,
    scale: fromVisual.scale,
    opacity: delay > 0 ? 0 : fromVisual.opacity,
    filter: `blur(${fromVisual.blur}px)`,
  })

  gsap.to(el, {
    y: finalVisual?.ty ?? 0,
    scale: finalVisual?.scale ?? 1,
    opacity: finalVisual?.opacity ?? 1,
    filter: `blur(${finalVisual?.blur ?? 0}px)`,
    duration: STACK_TWEEN_DURATION_S,
    ease: STACK_TWEEN_EASE,
    delay,
    overwrite: true,
  })
}

export interface IconStackProps {
  icons: Icon[]
  /** Which icon is the front card (panel anchor). Required for reliable stacking. */
  frontIconId: string
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
 * Stack preview layer shared by single-icon wireframe and multi-select modes.
 * One front card always hosts the primary icon; extra icons stack behind with depth
 * styling. Card fill and border are driven by `--stack-card-chrome` (0 = hidden).
 */
export function IconStack({
  icons,
  frontIconId,
  color,
  className,
  slotRef,
  frontCardRef,
  displaySize,
}: IconStackProps) {
  const style = useFilterStore((s) => s.style)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const prevIconIdsRef = useRef<string[]>([])
  const prevFrontIconIdRef = useRef<string | null>(null)

  const { frontIcon, behindIcons, displayIcons } = useMemo(() => {
    const front = icons.find((ic) => ic.id === frontIconId) ?? icons[0]
    if (front == null) {
      return {
        frontIcon: null,
        behindIcons: [] as Icon[],
        displayIcons: [] as Icon[],
      }
    }
    const restInCodeOrder = icons.filter((ic) => ic.id !== front.id)
    const capped = [front, ...restInCodeOrder].slice(0, MAX_STACK_ICONS)
    const behindInCodeOrder = capped.filter((ic) => ic.id !== front.id)
    return {
      frontIcon: front,
      behindIcons: behindInCodeOrder,
      displayIcons: capped,
    }
  }, [icons, frontIconId])

  useLayoutEffect(() => {
    const currentIds = displayIcons.map((icon) => icon.id)
    const prevIds = prevIconIdsRef.current
    const isInitialMount = prevIds.length === 0

    const addedIds = currentIds.filter((id) => !prevIds.includes(id))
    const removedIds = prevIds.filter((id) => !currentIds.includes(id))
    const isFirstStackedIcon =
      prevIds.length === 1 && currentIds.length >= 2
    const frontIconChanged = prevFrontIconIdRef.current !== frontIconId

    prevIconIdsRef.current = currentIds
    prevFrontIconIdRef.current = frontIconId

    if (isInitialMount) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    for (const id of removedIds) {
      const el = cardRefs.current.get(id)
      if (el != null) gsap.killTweensOf(el)
      cardRefs.current.delete(id)
    }

    const frontEl =
      typeof frontCardRef === 'object' && frontCardRef != null
        ? frontCardRef.current
        : cardRefs.current.get(frontIconId)

    if (frontEl != null && (frontIconChanged || removedIds.length > 0)) {
      gsap.killTweensOf(frontEl)
      gsap.set(frontEl, { clearProps: 'transform,filter,opacity' })
    }

    const behindCount = behindIcons.length

    for (let behindIndex = 0; behindIndex < behindIcons.length; behindIndex++) {
      const icon = behindIcons[behindIndex]
      const el = cardRefs.current.get(icon.id)
      if (el == null) continue

      const depthFromFront = depthFromFrontForBehindIndex(
        behindIndex,
        behindCount,
      )
      const isNew = addedIds.includes(icon.id)

      if (isNew) {
        const delaySecondCardBehindFront =
          isFirstStackedIcon && depthFromFront === 1

        animateCardToDepth(
          el,
          depthFromFront,
          reducedMotion,
          delaySecondCardBehindFront ? STACK_TWEEN_DURATION_S : 0,
        )
        continue
      }

      // Selection grew/shrank or order shifted — snap to the correct depth pose.
      gsap.killTweensOf(el)
      applyCardDepthPose(el, depthFromFront)
    }
  }, [displayIcons, behindIcons, frontIconId, frontCardRef])

  const slotSizeStyle =
    displaySize != null
      ? {
          width: Math.min(displaySize, 200),
          height: Math.min(displaySize, 200),
        }
      : undefined

  if (frontIcon == null) return null

  const behindCount = behindIcons.length

  return (
    <div className={cn('homepage-iconStack', className)}>
      <div
        ref={slotRef}
        className="homepage-iconStack__slot"
        style={slotSizeStyle}
      >
        {behindIcons.map((icon, behindIndex) => {
          const depthFromFront = depthFromFrontForBehindIndex(
            behindIndex,
            behindCount,
          )
          const visual = stackVisualForDepth(depthFromFront)

          return (
            <div
              key={icon.id}
              ref={(el) => {
                if (el != null) cardRefs.current.set(icon.id, el)
                else cardRefs.current.delete(icon.id)
              }}
              className="homepage-iconStack__card"
              style={cardTransformStyle(visual)}
            >
              <IconPreview
                path={icon.files[style]}
                tintColor={color}
                className="homepage-iconStack__icon"
              />
            </div>
          )
        })}

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
          className={cn(
            'homepage-iconStack__card',
            'homepage-iconStack__card--front',
          )}
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
