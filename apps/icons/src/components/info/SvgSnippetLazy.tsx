import { cn } from '@/lib/utils'
import { lazy, Suspense } from 'react'

const SvgSnippetCode = lazy(async () => {
  const m = await import('./SvgSnippetCode')
  return { default: m.SvgSnippetCode }
})

function SnippetFallback({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  return (
    <pre className={cn(className)} style={{ margin: 0 }}>
      <code>{code}</code>
    </pre>
  )
}

interface SvgSnippetLazyProps {
  code: string
  className?: string
}

/**
 * Lazy-loads the SVG/XML Prism highlighter in a separate chunk;
 * shows a plain monospace fallback until ready.
 */
export function SvgSnippetLazy({ code, className }: SvgSnippetLazyProps) {
  return (
    <Suspense fallback={<SnippetFallback code={code} className={className} />}>
      <SvgSnippetCode code={code} className={className} />
    </Suspense>
  )
}
