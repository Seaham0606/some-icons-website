import { IconPreview } from '@/components/icons/IconPreview'
import { useFilterStore } from '@/stores/filterStore'
import type { Icon } from '@/types/icon'
import { cn } from '@/lib/utils'
import { useMemo, type ReactElement } from 'react'

const GRID_UNITS = 24

function IconWireframeGridSvg() {
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
      className="homepage-iconWireframe__grid"
      viewBox={`0 0 ${GRID_UNITS} ${GRID_UNITS}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {lines}
    </svg>
  )
}

export interface IconWireframeProps {
  icon: Icon
  className?: string
}

/**
 * Icon preview framed by a proportional 24×24 unit grid; the glyph occupies the central 16×16 units
 * (scales with the component width — e.g. 240px-wide frame → ~10px per unit, ~160px glyph).
 */
export function IconWireframe({ icon, className }: IconWireframeProps) {
  const style = useFilterStore((s) => s.style)
  const path = icon.files[style]

  return (
    <div
      className={cn('homepage-iconWireframe', className)}
      data-slot="infoPanel-preview"
      aria-hidden
    >
      <IconWireframeGridSvg />
      <div className="homepage-iconWireframe__iconSlot">
        <div className="homepage-iconWireframe__icon">
          <IconPreview
            path={path}
            tintColor="var(--color-main-primary)"
            className="size-full min-h-0 min-w-0 rounded-[2px]"
          />
        </div>
      </div>
    </div>
  )
}
