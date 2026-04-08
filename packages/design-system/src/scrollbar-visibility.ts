const SCROLLBAR_ACTIVE_ATTR = 'data-scrollbar-active'

function parseTimeMs(raw: string): number {
  const value = raw.trim()
  const ms = /^([\d.]+)ms$/i.exec(value)
  if (ms) return Math.max(0, parseFloat(ms[1]))
  const sec = /^([\d.]+)s$/i.exec(value)
  if (sec) return Math.max(0, parseFloat(sec[1]) * 1000)
  return 1400
}

function readHideDelayMs(): number {
  if (typeof document === 'undefined') return 1400
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    '--ds-scrollbar-hide-delay',
  )
  return parseTimeMs(raw)
}

function parseCssPx(raw: string, fallback: number): number {
  const m = /^([\d.]+)px$/i.exec(raw.trim())
  return m ? Math.max(0, parseFloat(m[1])) : fallback
}

function readScrollbarThicknessPx(): number {
  if (typeof document === 'undefined') return 8
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--size-2')
  return parseCssPx(raw, 8)
}

function isScrollableY(el: HTMLElement): boolean {
  const s = getComputedStyle(el)
  if (s.overflowY !== 'auto' && s.overflowY !== 'scroll') return false
  return el.scrollHeight > el.clientHeight + 1
}

function isScrollableX(el: HTMLElement): boolean {
  const s = getComputedStyle(el)
  if (s.overflowX !== 'auto' && s.overflowX !== 'scroll') return false
  return el.scrollWidth > el.clientWidth + 1
}

/** True when (x, y) lies in the scrollbar gutter of this scrollable element. */
function pointInScrollbarGutter(
  el: HTMLElement,
  x: number,
  y: number,
  thickness: number,
): boolean {
  const r = el.getBoundingClientRect()
  const rtl = getComputedStyle(el).direction === 'rtl'

  if (isScrollableY(el)) {
    if (rtl) {
      if (x >= r.left && x <= r.left + thickness && y >= r.top && y <= r.bottom) {
        return true
      }
    } else if (
      x >= r.right - thickness &&
      x <= r.right &&
      y >= r.top &&
      y <= r.bottom
    ) {
      return true
    }
  }
  if (isScrollableX(el)) {
    if (
      y >= r.bottom - thickness &&
      y <= r.bottom &&
      x >= r.left &&
      x <= r.right
    ) {
      return true
    }
  }
  return false
}

function hitTestScrollbarTrack(clientX: number, clientY: number): boolean {
  const el = document.elementFromPoint(clientX, clientY)
  if (!el) return false

  const thickness = readScrollbarThicknessPx()
  let current: Element | null = el
  while (current && current !== document.documentElement) {
    if (
      current instanceof HTMLElement &&
      pointInScrollbarGutter(current, clientX, clientY, thickness)
    ) {
      return true
    }
    current = current.parentElement
  }

  if (document.documentElement instanceof HTMLElement) {
    if (
      pointInScrollbarGutter(document.documentElement, clientX, clientY, thickness)
    ) {
      return true
    }
  }

  return false
}

let installed = false

let hideDelayMs = 1400

function syncHideDelayFromCss(): void {
  hideDelayMs = readHideDelayMs()
}

/**
 * Shows the design-system scrollbar thumb while scrolling, when the pointer is over a scrollbar
 * gutter (track), then hides after `--ds-scrollbar-hide-delay` once idle and off the track.
 */
export function initDesignSystemScrollbarVisibility(): void {
  if (typeof document === 'undefined' || installed) return
  installed = true

  syncHideDelayFromCss()
  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', syncHideDelayFromCss)

  const root = document.documentElement
  let hideTimer: number | undefined
  let pointerOverTrack = false
  let pointerRaf = 0
  let lastClientX = 0
  let lastClientY = 0

  const cancelHide = () => {
    if (hideTimer !== undefined) {
      window.clearTimeout(hideTimer)
      hideTimer = undefined
    }
  }

  const armHide = () => {
    cancelHide()
    hideTimer = window.setTimeout(() => {
      root.removeAttribute(SCROLLBAR_ACTIVE_ATTR)
      hideTimer = undefined
    }, hideDelayMs)
  }

  const ensureVisible = () => {
    root.setAttribute(SCROLLBAR_ACTIVE_ATTR, '')
  }

  const onScroll = () => {
    ensureVisible()
    if (pointerOverTrack) cancelHide()
    else armHide()
  }

  const applyPointerTrack = (over: boolean) => {
    if (over === pointerOverTrack) return
    pointerOverTrack = over
    if (over) {
      ensureVisible()
      cancelHide()
    } else {
      armHide()
    }
  }

  const onPointerMove = (e: PointerEvent) => {
    lastClientX = e.clientX
    lastClientY = e.clientY
    if (pointerRaf !== 0) return
    pointerRaf = window.requestAnimationFrame(() => {
      pointerRaf = 0
      applyPointerTrack(hitTestScrollbarTrack(lastClientX, lastClientY))
    })
  }

  const onPointerOut = (e: PointerEvent) => {
    if (e.relatedTarget !== null) return
    if (pointerRaf !== 0) {
      window.cancelAnimationFrame(pointerRaf)
      pointerRaf = 0
    }
    applyPointerTrack(false)
  }

  document.addEventListener('scroll', onScroll, { capture: true, passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerout', onPointerOut, { passive: true })
}
