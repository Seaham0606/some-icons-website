import JSZip from 'jszip'
import { applyColorToSvg, ensureViewBox, setSvgDimensions } from './svg-utils'

interface ExportIcon {
  id: string
  svg: string
}

interface ExportOptions {
  size: number
  color: string | null
}

/** One processed SVG asset ready to download or add to a ZIP. */
export async function createExportBlobForIcon(
  svg: string,
  options: ExportOptions,
): Promise<Blob> {
  let processed = ensureViewBox(svg)
  processed = applyColorToSvg(processed, options.color)
  processed = setSvgDimensions(processed, options.size)

  return new Blob([processed], { type: 'image/svg+xml;charset=utf-8' })
}

export async function exportToZip(
  icons: ExportIcon[],
  options: ExportOptions
): Promise<Blob> {
  const zip = new JSZip()

  for (const { id, svg } of icons) {
    const blob = await createExportBlobForIcon(svg, options)
    zip.file(`${id}.svg`, blob)
  }

  return zip.generateAsync({ type: 'blob' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
