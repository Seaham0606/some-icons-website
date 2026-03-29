import type { IconStyle } from '@/types/icon'

/** Extend when adding Vue, plain HTML, etc. */
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

export function buildReactImportLine(exportNames: readonly string[]): string {
  return `import { ${exportNames.join(', ')} } from '${REACT_PACKAGE}'`
}

export function generateReactImportForSelection(
  orderedIconIds: readonly string[],
  style: IconStyle,
): string {
  const seen = new Set<string>()
  const names: string[] = []
  for (const id of orderedIconIds) {
    const exportName = iconIdToReactExportName(id, style)
    if (seen.has(exportName)) continue
    seen.add(exportName)
    names.push(exportName)
  }
  return buildReactImportLine(names)
}

export function generateFrameworkImportSnippet(
  framework: CodeFrameworkId,
  orderedIconIds: readonly string[],
  style: IconStyle,
): string {
  switch (framework) {
    case 'react':
      return generateReactImportForSelection(orderedIconIds, style)
    default: {
      const _never: never = framework
      return _never
    }
  }
}
