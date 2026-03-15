import JSZip from 'jszip'
import { applyColorToSvg, ensureViewBox, setSvgDimensions } from './svg-utils'
import type { ExportFormat } from './constants'

interface ExportIcon {
  id: string
  svg: string
}

interface ExportOptions {
  size: number
  format: ExportFormat
  color: string | null
}

export async function exportToZip(
  icons: ExportIcon[],
  options: ExportOptions
): Promise<Blob> {
  const zip = new JSZip()

  for (const { id, svg } of icons) {
    let processed = ensureViewBox(svg)
    processed = applyColorToSvg(processed, options.color)
    processed = setSvgDimensions(processed, options.size)

    if (options.format === 'svg') {
      zip.file(`${id}.svg`, processed)
    } else {
      const pngBlob = await svgToPng(processed, options.size)
      zip.file(`${id}.png`, pngBlob)
    }
  }

  return zip.generateAsync({ type: 'blob' })
}

async function svgToPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, size, size)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('PNG conversion failed'))
        }
      }, 'image/png')
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG'))
    }

    img.src = url
  })
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
