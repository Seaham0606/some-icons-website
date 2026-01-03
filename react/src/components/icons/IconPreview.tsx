import { useSvgFetch } from '@/hooks/useSvgFetch'
import { useColorStore } from '@/stores/colorStore'
import { cn } from '@/lib/utils'

interface IconPreviewProps {
  path: string | undefined
  className?: string
}

export function IconPreview({ path, className }: IconPreviewProps) {
  const { data: svg, isLoading, error } = useSvgFetch(path)
  const selectedColor = useColorStore((state) => state.selectedColor)

  if (isLoading) {
    return (
      <div className={cn('animate-pulse bg-muted rounded', className)} />
    )
  }

  if (error || !svg) {
    return (
      <div className={cn('flex items-center justify-center text-foreground-tertiary', className)}>
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
        backgroundColor: selectedColor ?? 'var(--item-grid)',
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
