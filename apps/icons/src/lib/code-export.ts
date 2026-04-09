import type { IconStyle } from '@/types/icon'

/** Extend when adding Vue, plain HTML, React Native, Svelte, etc. */
export type CodeFrameworkId = 'react'

const REACT_PACKAGE = '@someicons/icons-react'

const COPY_CTA_BY_FRAMEWORK: Record<CodeFrameworkId, string> = {
  react: 'Copy React code',
}

const COPY_SUCCESS_BY_FRAMEWORK: Record<CodeFrameworkId, string> = {
  react: 'Copied React code',
}

export function getDefaultCodeFramework(): CodeFrameworkId {
  return 'react'
}

export function getCodeCopyCtaLabel(framework: CodeFrameworkId): string {
  return COPY_CTA_BY_FRAMEWORK[framework]
}

export function getCodeCopySuccessLabel(framework: CodeFrameworkId): string {
  return COPY_SUCCESS_BY_FRAMEWORK[framework]
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
  colorHex: string | null = null,
): string {
  const sizeProp = `size={${size}}`
  if (colorHex != null && colorHex !== '') {
    return `<${componentName} ${sizeProp} color="${colorHex}" />`
  }
  return `<${componentName} ${sizeProp} />`
}

export function reactJsxUsageLinesForSelection(
  orderedIconIds: readonly string[],
  style: IconStyle,
  size: number,
  colorHex: string | null = null,
): string[] {
  return orderedIconIds.map((id) =>
    buildReactJsxUsageLine(iconIdToReactExportName(id, style), size, colorHex),
  )
}

/**
 * Full paste-ready React snippet: import(s) + JSX usage(s), selection order preserved for usage lines.
 */
export function generateReactSnippetForSelection(
  orderedIconIds: readonly string[],
  style: IconStyle,
  size: number,
  colorHex: string | null = null,
): string {
  if (orderedIconIds.length === 0) return ''

  const usageNames = orderedIconIds.map((id) =>
    iconIdToReactExportName(id, style),
  )
  const importNames = uniqueInOrder(usageNames)
  const importStmt = buildReactImportStatement(importNames)

  if (orderedIconIds.length === 1) {
    return `${importStmt}\n\n${buildReactJsxUsageLine(usageNames[0], size, colorHex)}`
  }

  const inner = usageNames
    .map((name) => `  ${buildReactJsxUsageLine(name, size, colorHex)}`)
    .join('\n')
  return `${importStmt}\n\n<>\n${inner}\n</>`
}

/** Input for framework snippet generators (shared by future targets). */
export interface FrameworkCodeSnippetContext {
  orderedIconIds: readonly string[]
  style: IconStyle
  /** Pixel size for generated component props (e.g. React `size`). */
  size: number
  /**
   * Custom `#RRGGBB` from the color field. When `null`, JSX omits `color` (package default / currentColor).
   */
  colorHex?: string | null
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
        ctx.colorHex ?? null,
      )
    default: {
      const _never: never = framework
      return _never
    }
  }
}
