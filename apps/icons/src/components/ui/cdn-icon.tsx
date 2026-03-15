import { useIcons } from '@/hooks/useIcons'
import { useSvgFetch } from '@/hooks/useSvgFetch'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface CdnIconProps {
  iconId: string
  className?: string
  style?: 'outline' | 'filled'
}

export function CdnIcon({ iconId, className, style = 'filled' }: CdnIconProps) {
  const { data: icons } = useIcons()
  const icon = useMemo(() => {
    return icons?.find((i) => i.id === iconId)
  }, [icons, iconId])
  
  const svgPath = icon?.files?.[style]
  const { data: svg } = useSvgFetch(svgPath)

  if (!svg) {
    return null
  }

  // Ensure viewBox is set and make SVG inherit currentColor
  let processedSvg = svg
  if (!/\bviewBox=/i.test(processedSvg)) {
    processedSvg = processedSvg.replace(/<svg/i, '<svg viewBox="0 0 24 24"')
  }
  // Replace fill and stroke with currentColor so it inherits text color
  processedSvg = processedSvg
    .replace(/fill="[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="[^"]*"/gi, 'stroke="currentColor"')
  
  // Add styling to SVG element to make it fill the container
  processedSvg = processedSvg.replace(
    /<svg([^>]*)>/i,
    '<svg$1 style="width: 100%; height: 100%; display: block;">'
  )

  return (
    <div
      className={cn('w-full h-full', className)}
      dangerouslySetInnerHTML={{ __html: processedSvg }}
    />
  )
}

