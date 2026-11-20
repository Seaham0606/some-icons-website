import { cn } from '@/lib/utils'
import { lazy, Suspense } from 'react'

const ReactSnippetCode = lazy(async () => {
  const m = await import('./ReactSnippetCode')
  return { default: m.ReactSnippetCode }
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

interface ReactSnippetLazyProps {
  code: string
  className?: string
}

/**
 * Lazy-loads Prism + TSX grammars in a separate chunk; shows plain monospace fallback until ready.
 */
export function ReactSnippetLazy({ code, className }: ReactSnippetLazyProps) {
  return (
    <Suspense fallback={<SnippetFallback code={code} className={className} />}>
      <ReactSnippetCode code={code} className={className} />
    </Suspense>
  )
}
