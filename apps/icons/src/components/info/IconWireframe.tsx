import {
  IconStack,
  MULTI_STACK_SLOT_PX,
  SINGLE_STACK_SLOT_PERCENT,
} from '@/components/info/IconStack'
import { cn } from '@/lib/utils'
import { useColorStore } from '@/stores/colorStore'
import type { Icon } from '@/types/icon'
import gsap from 'gsap'
import { EASE_OUT, MOTION_S } from '@/lib/motion'
import { useLayoutEffect, useMemo, useRef, type ReactElement, type Ref } from 'react'

const GRID_UNITS = 24

const WIREFRAME_TWEEN_DURATION_S = MOTION_S.slow
const WIREFRAME_TWEEN_EASE = EASE_OUT

function IconWireframeGridSvg({ gridRef }: { gridRef: Ref<SVGSVGElement> }) {
  const lines = useMemo(() => {
    const out: ReactElement[] = []
    for (let i = 1; i < GRID_UNITS; i++) {
      out.push(
        <line
          key={`v${i}`}
          x1={i}
          y1={0}
          x2={i}
          y2={GRID_UNITS}
          stroke="var(--color-border-weak)"
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
        />,
      )
      out.push(
        <line
          key={`h${i}`}
          x1={0}
          y1={i}
          x2={GRID_UNITS}
          y2={i}
          stroke="var(--color-border-weak)"
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
        />,
      )
    }
    return out
  }, [])

  return (
    <svg
      ref={gridRef}
      className="homepage-iconWireframe__grid"
      viewBox={`0 0 ${GRID_UNITS} ${GRID_UNITS}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {lines}
    </svg>
  )
}

function applySlotSize(slot: HTMLDivElement, multi: boolean, displaySize?: number) {
  if (displaySize != null) {
    const px = Math.min(displaySize, 200)
    gsap.set(slot, { width: px, height: px })
  } else {
    gsap.set(slot, {
      width: multi ? MULTI_STACK_SLOT_PX : `${SINGLE_STACK_SLOT_PERCENT}%`,
      height: 'auto',
    })
  }
}

function applyStackMode(
  slot: HTMLDivElement,
  frontCard: HTMLDivElement,
  multi: boolean,
  displaySize?: number,
) {
  applySlotSize(slot, multi, displaySize)
  gsap.set(frontCard, { '--stack-card-chrome': multi ? 1 : 0 })
}

/**
 * Resize the slot without tweening layout: apply the final size immediately, then play a
 * transform-only scale from the previous visual size (FLIP). Handles interrupted tweens by
 * measuring the slot's current visual width.
 */
function flipSlotSize(slot: HTMLDivElement, applySize: () => void) {
  const fromW = slot.offsetWidth * (Number(gsap.getProperty(slot, 'scale')) || 1)
  gsap.killTweensOf(slot)
  gsap.set(slot, { scale: 1 })
  applySize()
  const toW = slot.offsetWidth
  if (!fromW || !toW) return
  gsap.fromTo(
    slot,
    { scale: fromW / toW },
    {
      scale: 1,
      duration: WIREFRAME_TWEEN_DURATION_S,
      ease: WIREFRAME_TWEEN_EASE,
      clearProps: 'scale',
    },
  )
}

export interface IconWireframeProps {
  icon: Icon
  className?: string
  /**
   * Optional tint override for the preview. When omitted, uses the export colour from the colour
   * store (same as downloads/snippets); when that is unset, uses primary foreground so the glyph
   * matches typical `currentColor` in the UI.
   */
  color?: string
  /**
   * When set, the icon renders at this exact pixel size (actual-scale preview).
   * When omitted the icon fills 16/24 of the container (maximum display size).
   */
  displaySize?: number
  /**
   * When provided and length > 1, renders the IconStack multi-select view
   * instead of the grid + single icon.
   */
  selectedIcons?: Icon[]
}

/**
 * Icon preview framed by a proportional 24×24 unit grid. The icon always renders inside the
 * shared stack card layer; single mode hides card fill/stroke and uses a larger slot, multi-select
 * reveals chrome and stacks additional icons behind the front card.
 *
 * Stacking order: the most recently selected icon (last in `selectedIcons`) sits on top;
 * older selections cascade behind it, oldest at the bottom.
 */
export function IconWireframe({
  icon,
  className,
  color,
  displaySize,
  selectedIcons,
}: IconWireframeProps) {
  const selectedExportColor = useColorStore((s) => s.selectedColor)

  const previewTint =
    color ?? selectedExportColor ?? 'var(--color-main-primary)'

  const isMultiSelect = selectedIcons != null && selectedIcons.length > 1
  const previewIcons =
    isMultiSelect && selectedIcons != null ? selectedIcons : [icon]

  // The visual front card is always the most recently selected (last in list).
  const stackFrontIconId =
    isMultiSelect && selectedIcons != null && selectedIcons.length > 0
      ? (selectedIcons[selectedIcons.length - 1]?.id ?? icon.id)
      : icon.id

  const gridRef = useRef<SVGSVGElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const frontCardRef = useRef<HTMLDivElement>(null)
  const prevMultiSelectRef = useRef<boolean | null>(null)
  const prevAnchorIdRef = useRef(icon.id)
  const prevStackFrontIdRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const els = [gridRef.current, slotRef.current, frontCardRef.current].filter(
      (el): el is NonNullable<typeof el> => el != null,
    )
    return () => {
      gsap.killTweensOf(els)
    }
  }, [])

  useLayoutEffect(() => {
    const grid = gridRef.current
    const slot = slotRef.current
    const frontCard = frontCardRef.current
    const wasMulti = prevMultiSelectRef.current
    const prevStackFrontId = prevStackFrontIdRef.current
    const anchorChanged = prevAnchorIdRef.current !== icon.id

    prevMultiSelectRef.current = isMultiSelect
    prevAnchorIdRef.current = icon.id
    prevStackFrontIdRef.current = stackFrontIconId

    if (grid == null || slot == null || frontCard == null) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    // ── Initial mount ──
    if (wasMulti === null) {
      gsap.set(grid, { opacity: isMultiSelect ? 0 : 1 })
      applyStackMode(slot, frontCard, isMultiSelect, displaySize)
      return
    }

    // ── Single → Multi ──
    if (isMultiSelect && !wasMulti) {
      if (reducedMotion) {
        gsap.set(grid, { opacity: 0 })
        applyStackMode(slot, frontCard, true, displaySize)
        return
      }

      gsap.killTweensOf(grid)
      gsap.to(grid, {
        opacity: 0,
        duration: WIREFRAME_TWEEN_DURATION_S,
        ease: WIREFRAME_TWEEN_EASE,
      })
      flipSlotSize(slot, () => applySlotSize(slot, true, displaySize))
      // Chrome tween runs independently so it doesn't cancel IconStack's entrance animation
      gsap.to(frontCard, {
        '--stack-card-chrome': 1,
        duration: WIREFRAME_TWEEN_DURATION_S,
        ease: WIREFRAME_TWEEN_EASE,
        overwrite: 'auto',
      })
      return
    }

    // ── Multi → Single ──
    if (!isMultiSelect && wasMulti) {
      if (reducedMotion) {
        gsap.set(grid, { opacity: 1 })
        applyStackMode(slot, frontCard, false, displaySize)
        return
      }

      gsap.killTweensOf(grid)
      gsap.to(grid, {
        opacity: 1,
        duration: WIREFRAME_TWEEN_DURATION_S,
        ease: WIREFRAME_TWEEN_EASE,
      })
      flipSlotSize(slot, () => applySlotSize(slot, false, displaySize))
      gsap.to(frontCard, {
        '--stack-card-chrome': 0,
        duration: WIREFRAME_TWEEN_DURATION_S,
        ease: WIREFRAME_TWEEN_EASE,
        overwrite: 'auto',
      })
      return
    }

    // ── Single mode, anchor icon changed ──
    if (!isMultiSelect) {
      gsap.set(grid, { opacity: 1 })
      applyStackMode(slot, frontCard, false, displaySize)
      return
    }

    // ── Multi mode, front card changed (new icon selected into stack) ──
    if (stackFrontIconId !== prevStackFrontId) {
      // New front card needs its chrome set to 1 immediately (already in multi mode)
      gsap.set(frontCard, { '--stack-card-chrome': 1 })
      // Ensure slot dimensions are correct (e.g. displaySize changed)
      if (displaySize != null) {
        const px = Math.min(displaySize, 200)
        gsap.set(slot, { width: px, height: px })
      }
      return
    }

    // ── Multi mode, anchor changed but front is the same ──
    if (anchorChanged) {
      applyStackMode(slot, frontCard, true, displaySize)
    }
  }, [isMultiSelect, displaySize, icon.id, stackFrontIconId])

  return (
    <div
      className={cn(
        'homepage-iconWireframe',
        isMultiSelect && 'homepage-iconWireframe--multiSelect',
        className,
      )}
      data-slot="infoPanel-preview"
    >
      <div className="homepage-iconWireframe__clip">
        <IconWireframeGridSvg gridRef={gridRef} />

        <IconStack
          icons={previewIcons}
          color={previewTint}
          slotRef={slotRef}
          frontCardRef={frontCardRef}
          displaySize={!isMultiSelect ? displaySize : undefined}
        />
      </div>
    </div>
  )
}
