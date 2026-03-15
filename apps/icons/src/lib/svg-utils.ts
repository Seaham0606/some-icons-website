export function ensureViewBox(svg: string): string {
  if (!/\bviewBox=/i.test(svg)) {
    return svg.replace(/<svg/i, '<svg viewBox="0 0 16 16"')
  }
  return svg
}

export function applyColorToSvg(
  svg: string,
  color: string | null,
  forDisplay = false
): string {
  if (color === null && !forDisplay) {
    return svg
  }

  const targetColor = color ?? getCurrentThemeColor()

  return svg
    .replaceAll('currentColor', targetColor)
    .replace(
      /(fill\s*=\s*["']?)(#?[0-9a-fA-F]{3,6}|currentColor)(["']?)/gi,
      (match, prefix, val, suffix) => {
        const lowerVal = val.toLowerCase()
        if (['none', 'transparent', 'inherit'].includes(lowerVal)) {
          return match
        }
        return prefix + targetColor + suffix
      }
    )
    .replace(
      /(stroke\s*=\s*["']?)(#?[0-9a-fA-F]{3,6}|currentColor)(["']?)/gi,
      (match, prefix, val, suffix) => {
        const lowerVal = val.toLowerCase()
        if (['none', 'transparent', 'inherit'].includes(lowerVal)) {
          return match
        }
        return prefix + targetColor + suffix
      }
    )
}

export function getCurrentThemeColor(): string {
  const isDark =
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.hasAttribute('data-theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  return isDark ? '#B3B3B3' : '#131313'
}

export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export function normalizeHexColor(hex: string): string {
  let normalized = hex.trim()

  if (!normalized.startsWith('#')) {
    normalized = '#' + normalized
  }

  if (/^#[A-Fa-f0-9]{3}$/.test(normalized)) {
    const r = normalized[1]
    const g = normalized[2]
    const b = normalized[3]
    normalized = `#${r}${r}${g}${g}${b}${b}`
  }

  return normalized.toUpperCase()
}

export function setSvgDimensions(svg: string, size: number): string {
  let result = svg

  if (/width="[^"]*"/i.test(result)) {
    result = result.replace(/width="[^"]*"/i, `width="${size}"`)
  } else {
    result = result.replace(/<svg/i, `<svg width="${size}"`)
  }

  if (/height="[^"]*"/i.test(result)) {
    result = result.replace(/height="[^"]*"/i, `height="${size}"`)
  } else {
    result = result.replace(/<svg/i, `<svg height="${size}"`)
  }

  return result
}
