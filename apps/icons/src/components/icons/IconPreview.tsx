import { useSvgFetch } from '@/hooks/useSvgFetch'
import { cn } from '@/lib/utils'

interface IconPreviewProps {
  path: string | undefined
  className?: string
  /** Explicit tint colour for this preview. Defaults to the secondary text colour. */
  tintColor?: string
}

export function IconPreview({ path, className, tintColor }: IconPreviewProps) {
  const { data: svg, isLoading, error } = useSvgFetch(path)
  const resolvedTint = tintColor ?? 'var(--color-main-secondary)'

  if (isLoading) {
    return (
      <div
        // Use the same grid color as real icon previews so the UI isn't "white on white".
        className={cn('animate-pulse bg-[var(--item-grid)] rounded', className)}
      />
    )
  }

  if (error || !svg) {
    return (
      <div
        className={cn('flex items-center justify-center text-[var(--color-main-tertiary)]', className)}
      >
        ?
      </div>
    )
  }

  // Normalize SVG for mask usage (ensure it works as a mask)
  const normalizedSvg = svg
    .replace(/fill="[^"]*"/gi, 'fill="white"')
    .replace(/stroke="[^"]*"/gi, 'stroke="white"')
    .replace(/currentColor/gi, 'white')

  const encoded = encodeURIComponent(normalizedSvg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')

  const maskUrl = `url("data:image/svg+xml,${encoded}")`

  return (
    <div
      className={cn('transition-colors', className)}
      style={{
        backgroundColor: resolvedTint,
        WebkitMaskImage: maskUrl,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: maskUrl,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  )
}
