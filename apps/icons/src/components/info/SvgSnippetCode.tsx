import { reactSnippetPrismTheme } from '@/lib/react-snippet-prism-theme'
import { Prism } from '@/lib/prism-tsx'
import { Highlight } from 'prism-react-renderer'
import { cn } from '@/lib/utils'

interface SvgSnippetCodeProps {
  code: string
  className?: string
}

/**
 * SVG/XML snippet with Prism token colors mapped to design-system semantic variables.
 * Reuses the markup grammar that is already loaded by prism-tsx.ts.
 */
export function SvgSnippetCode({ code, className }: SvgSnippetCodeProps) {
  return (
    <Highlight
      prism={Prism}
      theme={reactSnippetPrismTheme}
      code={code}
      language="markup"
    >
      {({ className: hlClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(hlClassName, className)}
          style={{
            ...style,
            background: 'transparent',
            margin: 0,
          }}
        >
          {tokens.map((line, lineIndex) => (
            <div key={lineIndex} {...getLineProps({ line })}>
              {line.map((token, tokenIndex) => (
                <span key={tokenIndex} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
