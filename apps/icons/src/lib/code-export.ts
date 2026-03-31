import type { IconStyle } from '@/types/icon'

/** Extend when adding Vue, plain HTML, React Native, Svelte, etc. */
export type CodeFrameworkId = 'react'

const REACT_PACKAGE = '@someicons/icons-react'

const COPY_CTA_BY_FRAMEWORK: Record<CodeFrameworkId, string> = {
  react: 'Copy React code',
}

export function getDefaultCodeFramework(): CodeFrameworkId {
  return 'react'
}

export function getCodeCopyCtaLabel(framework: CodeFrameworkId): string {
  return COPY_CTA_BY_FRAMEWORK[framework]
}

function kebabCaseToPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((segment) => {
      const head = segment.charAt(0).toUpperCase()
      const rest = segment.slice(1)
      return head + rest
    })
    .join('')
}

/**
 * Public name for a React icon component in `@someicons/icons-react`:
 * PascalCase from the icon `id`, with `Filled` appended for filled variants.
 */
export function iconIdToReactExportName(iconId: string, style: IconStyle): string {
  const pascal = kebabCaseToPascalCase(iconId)
  return style === 'filled' ? `${pascal}Filled` : pascal
}

/** Unique strings, first occurrence wins (stable import specifiers). */
function uniqueInOrder(values: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of values) {
    if (seen.has(v)) continue
    seen.add(v)
    out.push(v)
  }
  return out
}

/** Single-line import `{ A, B }` — useful for tests or narrow reuse. */
export function buildReactImportLine(exportNames: readonly string[]): string {
  return `import { ${exportNames.join(', ')} } from '${REACT_PACKAGE}'`
}

/**
 * React import: one line for a single export; multi-line block for several.
 */
export function buildReactImportStatement(
  orderedUniqueExportNames: readonly string[],
): string {
  const n = orderedUniqueExportNames.length
  if (n === 0) return ''
  if (n === 1) {
    return `import { ${orderedUniqueExportNames[0]} } from '${REACT_PACKAGE}'`
  }
  const lines = orderedUniqueExportNames.map((name, i) => {
    const comma = i < n - 1 ? ',' : ''
    return `  ${name}${comma}`
  })
  return `import {\n${lines.join('\n')}\n} from '${REACT_PACKAGE}'`
}

export function buildReactJsxUsageLine(
  componentName: string,
  size: number,
): string {
  return `<${componentName} size={${size}} />`
}

export function reactJsxUsageLinesForSelection(
  orderedIconIds: readonly string[],
  style: IconStyle,
  size: number,
): string[] {
  return orderedIconIds.map((id) =>
    buildReactJsxUsageLine(iconIdToReactExportName(id, style), size),
  )
}

/**
 * Full paste-ready React snippet: import(s) + JSX usage(s), selection order preserved for usage lines.
 */
export function generateReactSnippetForSelection(
  orderedIconIds: readonly string[],
  style: IconStyle,
  size: number,
): string {
  if (orderedIconIds.length === 0) return ''

  const usageNames = orderedIconIds.map((id) =>
    iconIdToReactExportName(id, style),
  )
  const importNames = uniqueInOrder(usageNames)
  const importStmt = buildReactImportStatement(importNames)

  if (orderedIconIds.length === 1) {
    return `${importStmt}\n\n${buildReactJsxUsageLine(usageNames[0], size)}`
  }

  const inner = usageNames
    .map((name) => `  ${buildReactJsxUsageLine(name, size)}`)
    .join('\n')
  return `${importStmt}\n\n<>\n${inner}\n</>`
}

/** Input for framework snippet generators (shared by future targets). */
export interface FrameworkCodeSnippetContext {
  orderedIconIds: readonly string[]
  style: IconStyle
  /** Pixel size for generated component props (e.g. React `size`). */
  size: number
}

export function generateFrameworkCodeSnippet(
  framework: CodeFrameworkId,
  ctx: FrameworkCodeSnippetContext,
): string {
  switch (framework) {
    case 'react':
      return generateReactSnippetForSelection(
        ctx.orderedIconIds,
        ctx.style,
        ctx.size,
      )
    default: {
      const _never: never = framework
      return _never
    }
  }
}
