import { Analytics } from '@vercel/analytics/react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { SI_ICONS, type SomeIcon } from './icons-data'

// ─── CDN ──────────────────────────────────────────────────────────────────────

const CDN_BASE_URL = 'https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/'

type IconFiles = { outline?: string; filled?: string }

const svgCache = new Map<string, string>()
const inflightFetches = new Map<string, Promise<string>>()

function fetchSvgPath(path: string): Promise<string> {
  if (svgCache.has(path)) return Promise.resolve(svgCache.get(path)!)
  if (inflightFetches.has(path)) return inflightFetches.get(path)!
  const promise = fetch(`${CDN_BASE_URL}${path}`)
    .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.text() })
    .then(text => { svgCache.set(path, text); inflightFetches.delete(path); return text })
    .catch(err => { inflightFetches.delete(path); throw err })
  inflightFetches.set(path, promise)
  return promise
}

function useSvg(path: string | undefined): string | null {
  const [svg, setSvg] = useState<string | null>(() => path ? svgCache.get(path) ?? null : null)
  useEffect(() => {
    if (!path) { setSvg(null); return }
    const cached = svgCache.get(path)
    if (cached) { setSvg(cached); return }
    setSvg(null)
    let active = true
    fetchSvgPath(path).then(text => { if (active) setSvg(text) }).catch(() => {})
    return () => { active = false }
  }, [path])
  return svg
}

// ─── Components ───────────────────────────────────────────────────────────────

function CdnSvgIcon({ ic, files, size = 24, fill = false, color }: {
  ic: SomeIcon | undefined
  files: IconFiles | undefined
  size?: number | string
  fill?: boolean
  color?: string
}) {
  const path = files ? (fill ? files.filled : files.outline) : undefined
  const svg = useSvg(path)

  if (!svg) return <span style={{ display: 'block', width: size, height: size }} />

  const sized = svg
    .replace(/width="[^"]*"/i, `width="${size}"`)
    .replace(/height="[^"]*"/i, `height="${size}"`)

  return (
    <span
      dangerouslySetInnerHTML={{ __html: sized }}
      style={{ display: 'block', lineHeight: 0, ...(color ? { color } : {}) }}
    />
  )
}

function copyToClipboard(text: string) {
  try { navigator.clipboard?.writeText(text).catch(() => {}) } catch {}
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return (localStorage.getItem('si-site-theme') as 'light' | 'dark') || 'light' } catch { return 'light' }
  })
  const [cdnFiles, setCdnFiles] = useState<Map<string, IconFiles>>(new Map())
  const [query, setQuery] = useState('')
  const [style, setStyle] = useState<'outline' | 'fill'>('outline')
  const [cat, setCat] = useState('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [demoStyle, setDemoStyle] = useState<'outline' | 'fill'>('outline')
  const [demoColorIdx, setDemoColorIdx] = useState(1)
  const [gridIdx, setGridIdx] = useState(0)
  const [svgCopied, setSvgCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const svgCopiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const browserCardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const hideOffsetRef = useRef(360)
  const settleRangeRef = useRef(320)

  // Fetch CDN index once — only to get file paths for our curated icon set
  useEffect(() => {
    fetch(`${CDN_BASE_URL}index.json`)
      .then(r => r.json())
      .then((data: { icons: Array<{ id: string; files: IconFiles }> }) => {
        const map = new Map<string, IconFiles>()
        data.icons.forEach(ic => map.set(ic.id, ic.files))
        setCdnFiles(map)
      })
      .catch(() => {})
  }, [])

  // Pre-fetch priority icon SVGs after CDN paths are known
  useEffect(() => {
    if (cdnFiles.size === 0) return
    const priority = ['camera','heart','settings','search','home','user','calendar','file','arrow-right','bell','bookmark','shopping-bag','mail','image','star','download','play','grid','chevron-right','lock','cloud','tag']
    priority.forEach(id => {
      const files = cdnFiles.get(id)
      if (files?.outline) fetchSvgPath(files.outline).catch(() => {})
      if (files?.filled) fetchSvgPath(files.filled).catch(() => {})
    })
  }, [cdnFiles])

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '')
    try { localStorage.setItem('si-site-theme', theme) } catch {}
  }, [theme])

  // Scroll-driven browser card animation
  const measureLayout = useCallback(() => {
    const card = browserCardRef.current
    if (!card) return
    const vh = window.innerHeight || 800
    const prevTrans = card.style.transform
    const prevTransition = card.style.transition
    card.style.transition = 'none'
    card.style.transform = 'none'
    const rect = card.getBoundingClientRect()
    const flowTopDoc = rect.top + (window.scrollY || 0)
    card.style.transform = prevTrans
    card.style.transition = prevTransition
    hideOffsetRef.current = Math.max(220, vh - flowTopDoc + 56)
    settleRangeRef.current = Math.max(180, hideOffsetRef.current * 0.9)
  }, [])

  const updateSlide = useCallback(() => {
    const card = browserCardRef.current
    if (!card) return
    const off = hideOffsetRef.current
    const range = settleRangeRef.current
    const sy = window.scrollY || 0
    let p = sy / range
    p = Math.max(0, Math.min(1, p))
    const e = 1 - Math.pow(1 - p, 3)
    const ty = (1 - e) * off
    const sc = 0.96 + 0.04 * e
    card.style.opacity = String(Math.min(1, e * 1.18))
    card.style.transform = `translateY(${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`
    card.style.boxShadow = `0 ${(24 * e).toFixed(1)}px ${(60 * e).toFixed(1)}px -28px rgba(0,0,0,${(0.22 * e).toFixed(3)}), 0 2px 6px rgba(0,0,0,${(0.04 * e).toFixed(3)})`
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => { rafRef.current = undefined; updateSlide() })
    }
    const onResize = () => measureLayout()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    measureLayout()
    const t1 = setTimeout(() => measureLayout(), 140)
    const t2 = setTimeout(() => measureLayout(), 520)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      clearTimeout(t1); clearTimeout(t2)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [measureLayout, updateSlide])

  // ── Helpers ──
  function iconById(id: string): SomeIcon | undefined {
    return SI_ICONS.find(i => i.id === id)
  }

  // ── Derived state ──
  const coverageOrder = ['Interface','Arrows','Commerce','Files','Media','Devices','Weather','Symbols']
  const cats = ['All', ...coverageOrder.filter(c => SI_ICONS.some(i => i.cat === c))]
  const q = query.trim().toLowerCase()
  const filtered = SI_ICONS.filter(ic => {
    if (cat !== 'All' && ic.cat !== cat) return false
    if (!q) return true
    return ic.label.toLowerCase().includes(q) ||
      ic.id.toLowerCase().includes(q) ||
      ic.cat.toLowerCase().includes(q)
  })

  async function copyIcon(ic: SomeIcon) {
    const files = cdnFiles.get(ic.id)
    const path = files ? (style === 'fill' ? files.filled : files.outline) : undefined
    if (!path) return
    try {
      const svg = await fetchSvgPath(path)
      copyToClipboard(svg)
    } catch { return }
    setCopiedId(ic.id)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopiedId(null), 1400)
  }

  async function copyDemoSvg() {
    const files = cdnFiles.get('camera')
    const path = files ? (demoStyle === 'fill' ? files.filled : files.outline) : undefined
    if (!path) return
    try {
      const svg = await fetchSvgPath(path)
      copyToClipboard(svg)
    } catch { return }
    setSvgCopied(true)
    clearTimeout(svgCopiedTimer.current)
    svgCopiedTimer.current = setTimeout(() => setSvgCopied(false), 1500)
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' })
  }

  function segStyle(selected: boolean): React.CSSProperties {
    return selected
      ? { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', height: '100%', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, border: '1px solid var(--color-border-base)', backgroundImage: 'var(--button-gradient-inverse)', backgroundOrigin: 'border-box', color: 'var(--color-main-primary)', cursor: 'pointer' }
      : { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', height: '100%', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, border: '1px solid transparent', background: 'transparent', color: 'var(--color-main-primary)', opacity: 0.3, cursor: 'pointer' }
  }

  function pillStyle(active: boolean): React.CSSProperties {
    return active
      ? { padding: '6px 13px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid transparent', background: 'var(--color-main-primary)', color: 'var(--color-background-strong)' }
      : { padding: '6px 13px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', border: '1px solid var(--color-border-weak)', background: 'transparent', color: 'var(--color-main-secondary)' }
  }

  // Hero atmospheric icons
  const heroNames = ['search','home','user','calendar','heart','file','arrow-right','settings','bell','bookmark','camera','shopping-bag','mail','image','star','download','play','grid','chevron-right','lock','cloud','tag']
  const heroPool = heroNames.map(n => iconById(n)).filter(Boolean) as SomeIcon[]
  const pool = heroPool.length >= 8 ? heroPool : SI_ICONS.slice(0, 24)
  const cols = 7, rows = 6
  const heroIcons: Array<{ key: string; ic: SomeIcon; style: React.CSSProperties; fill: boolean; size: number }> = []
  let k = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ic = pool[(r * cols + c) % pool.length]
      if (!ic) continue
      const h = ((r * 73856093) ^ (c * 19349663)) >>> 0
      const jx = ((h % 1000) / 1000 - 0.5) * 4.4
      const jy = (((h >> 10) % 1000) / 1000 - 0.5) * 4.4
      const left = ((c + 0.5) / cols) * 100 + jx
      const top = ((r + 0.5) / rows) * 100 + jy
      const big = (h % 7) === 0
      const blur = (h % 5) === 0
      const fill = (h % 3) === 0
      const size = big ? 46 : 32
      const op = blur ? 0.05 : big ? 0.08 : 0.07
      heroIcons.push({
        key: `h${k++}`, ic, fill, size,
        style: { position: 'absolute', left: `${left.toFixed(2)}%`, top: `${top.toFixed(2)}%`, transform: 'translate(-50%,-50%)', opacity: op, filter: blur ? 'blur(1.4px)' : 'none', display: 'block' }
      })
    }
  }

  // Grid section
  const gridIds = ['camera','bell','settings','heart','bookmark','search','home','shopping-bag']
  const gridIc = iconById(gridIds[gridIdx]) ?? SI_ICONS[0]

  // Demos
  const demoIc = iconById('camera')
  const heartIc = iconById('heart')
  const sizeIc = iconById('settings')
  const colorOpts = [
    { label: 'Text', val: 'var(--color-main-primary)' },
    { label: 'Blue', val: 'var(--color-blue-500)' },
    { label: 'Green', val: 'var(--color-green-500)' },
    { label: 'Purple', val: 'var(--color-purple-500)' },
    { label: 'Pink', val: 'var(--color-pink-500)' },
    { label: 'Orange', val: 'var(--color-orange-500)' },
  ]
  const demoColor = colorOpts[demoColorIdx].val

  // SVG code preview — fetched from CDN
  const demoFiles = cdnFiles.get('camera')
  const demoSvgPath = demoFiles ? (demoStyle === 'fill' ? demoFiles.filled : demoFiles.outline) : undefined
  const svgCode = useSvg(demoSvgPath) ?? ''

  // Coverage
  const coverageCats = coverageOrder.map(name => ({
    name, list: SI_ICONS.filter(ic => ic.cat === name)
  })).filter(c => c.list.length > 0)

  // Compare check icons
  const CheckYes = () => (
    <span style={{ width: 26, height: 26, borderRadius: '9999px', background: 'var(--color-green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
    </span>
  )
  const CheckPartial = () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '12.5px', fontWeight: 600, color: 'var(--color-main-tertiary)' }}>
      <span style={{ width: 26, height: 26, borderRadius: '9999px', border: '1px solid var(--color-border-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-main-tertiary)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M5 12h14"/></svg>
      </span>
      Varies
    </span>
  )
  const CheckNo = () => (
    <span style={{ width: 26, height: 26, borderRadius: '9999px', border: '1px solid var(--color-border-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-main-tertiary)' }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </span>
  )

  const compareRows = [
    { key: 'geo',   title: 'Outline & fill share one geometry', desc: 'Both styles built from identical paths',   them: <CheckPartial /> },
    { key: 'grid',  title: 'Drawn on a single 24px grid',       desc: 'Consistent keylines across the whole set', them: <CheckPartial /> },
    { key: 'pixel', title: 'Pixel-tuned for small sizes',       desc: 'Legible and crisp from 12px up',           them: <CheckNo /> },
    { key: 'cc',    title: 'currentColor native',               desc: 'Inherits text color, no recoloring',       them: <CheckYes /> },
    { key: 'svg',   title: 'Clean, minimal SVG output',         desc: 'No groups, no clutter — ready to paste',   them: <CheckPartial /> },
    { key: 'mit',   title: 'MIT licensed, no attribution',      desc: 'Free in commercial work',                  them: <CheckPartial /> },
  ]

  const isDark = theme === 'dark'

  return (
    <div data-theme={isDark ? 'dark' : 'light'} style={{ background: 'var(--color-background-base)', color: 'var(--color-main-primary)', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Analytics />

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 64, display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-border-extra-weak)', background: 'color-mix(in srgb, var(--color-background-base) 82%, transparent)', backdropFilter: 'blur(12px)' }}>
        <div style={{ width: '100%', maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>Some Icons</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => scrollTo('browser')} style={{ padding: '8px 12px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: 'var(--color-main-secondary)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Icons</button>
            <button onClick={() => scrollTo('why')} style={{ padding: '8px 12px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: 'var(--color-main-secondary)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Why</button>
            <button onClick={() => scrollTo('install')} style={{ padding: '8px 12px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: 'var(--color-main-secondary)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Install</button>
            <span style={{ width: 1, height: 22, background: 'var(--color-border-base)', margin: '0 6px' }} />
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', borderRadius: 8, color: 'var(--color-main-secondary)', cursor: 'pointer' }}>
              {isDark
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <a href="https://github.com/seaham0606/some-icons" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border-base)', backgroundImage: 'var(--button-gradient-tertiary)', fontSize: 14, fontWeight: 600 }}>
              <img className="gh-ico" src="/assets/logo-github-icon.svg" width="16" height="16" alt="" style={{ display: 'block' }} />
              <span>4.2k</span>
            </a>
            <a href="https://icons.someicons.com" style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-gray-950)', backgroundImage: 'var(--button-gradient-primary)', color: 'var(--color-main-inverse-primary)', fontSize: 14, fontWeight: 600 }}>Open app</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header id="hero" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(108px,18vh,260px) 24px 0', overflow: 'visible' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, pointerEvents: 'none', color: 'var(--color-main-primary)', WebkitMaskImage: 'radial-gradient(ellipse 60% 48% at 50% 38%, transparent 0%, transparent 22%, #000 64%)', maskImage: 'radial-gradient(ellipse 60% 48% at 50% 38%, transparent 0%, transparent 22%, #000 64%)' }}>
          {heroIcons.map(({ key, ic, style: s, fill, size }) => (
            <span key={key} style={s}><CdnSvgIcon ic={ic} files={cdnFiles.get(ic.id)} size={size} fill={fill} /></span>
          ))}
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%,-50%)', width: 680, height: 440, maxWidth: '92%', background: 'radial-gradient(ellipse at center, var(--color-blue-alpha-50), transparent 68%)', filter: 'blur(18px)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 10px', borderRadius: 9999, border: '1px solid var(--color-border-base)', background: 'var(--color-background-strong)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-main-secondary)', marginBottom: 26, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <span style={{ width: 7, height: 7, borderRadius: 9999, background: 'var(--color-blue-400)' }} />
            Open source · MIT · 1,200+ icons
          </span>
          <h1 style={{ fontSize: 'clamp(42px,7vw,80px)', fontWeight: 760, letterSpacing: '-0.037em', lineHeight: 1.0, maxWidth: '14ch', marginBottom: 24 }}>Icons that fit right&nbsp;in.</h1>
          <p style={{ fontSize: 'clamp(16px,1.65vw,19px)', lineHeight: 1.58, fontWeight: 450, color: 'var(--color-main-secondary)', maxWidth: 560, marginBottom: 36 }}>
            A growing library of 1,200+ pixel-perfect icons. Outline or fill, any size, tuned to{' '}
            <code style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.88em', padding: '1px 6px', borderRadius: 6, background: 'var(--color-background-weak)', color: 'var(--color-main-primary)' }}>currentColor</code>.
            <br/>Copy clean SVG or drop straight into Figma, Framer and code.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => scrollTo('browser')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 10, border: '1px solid var(--color-gray-950)', backgroundImage: 'var(--button-gradient-primary)', color: 'var(--color-main-inverse-primary)', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Browse icons
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="https://github.com/seaham0606/some-icons" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 10, border: '1px solid var(--color-border-base)', backgroundImage: 'var(--button-gradient-tertiary)', fontSize: 15, fontWeight: 600 }}>
              <img className="gh-ico" src="/assets/logo-github-icon.svg" width="17" height="17" alt="" />
              Star on GitHub
            </a>
          </div>
        </div>

        {/* ── LIVE BROWSER ── */}
        <div id="browser" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1120, margin: '40px auto 0', padding: 0 }}>
          <div ref={browserCardRef} style={{ border: '1px solid var(--color-border-base)', borderRadius: 20, background: 'var(--color-background-strong)', overflow: 'hidden', opacity: 0, transform: 'translateY(70vh) scale(0.96)', transformOrigin: '50% 0%', willChange: 'transform, opacity' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: '1px solid var(--color-border-extra-weak)', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 9, height: 44, borderRadius: 12, border: '1px solid var(--color-border-weak)', background: 'var(--color-background-input)', padding: '0 13px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ color: 'var(--color-main-tertiary)', flexShrink: 0 }}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search 1,200+ icons…" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: 'var(--color-main-primary)', minWidth: 0 }} />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Clear" style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: 'var(--color-main-tertiary)', flexShrink: 0, cursor: 'pointer' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: 3, padding: 2, borderRadius: 10, border: '1px solid var(--color-border-weak)', background: 'var(--color-background-input)', height: 44 }}>
                <button onClick={() => setStyle('outline')} style={segStyle(style === 'outline')}>Outline</button>
                <button onClick={() => setStyle('fill')} style={segStyle(style === 'fill')}>Fill</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 7, padding: '14px 16px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} style={pillStyle(c === cat)}>{c}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-main-tertiary)' }}>{filtered.length} {filtered.length === 1 ? 'icon' : 'icons'}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-main-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                Click any icon to copy
              </span>
            </div>
            <div style={{ padding: '4px 16px 20px' }}>
              {filtered.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(76px,1fr))', gap: 8 }}>
                  {filtered.map(ic => (
                    <button key={ic.id} onClick={() => copyIcon(ic)} title={ic.label} style={{ position: 'relative', aspectRatio: '1/1', border: '1px solid var(--color-border-extra-weak)', borderRadius: 12, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-main-primary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <CdnSvgIcon ic={ic} files={cdnFiles.get(ic.id)} fill={style === 'fill'} />
                      {copiedId === ic.id && (
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 12, background: 'var(--color-background-elevation)', border: '1px solid var(--color-intent-accent)', fontSize: 11, fontWeight: 600, color: 'var(--color-intent-accent)' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                          Copied
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '64px 20px', color: 'var(--color-main-tertiary)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>No icons match "{query}"</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', border: '1px solid var(--color-border-base)', borderRadius: 16, overflow: 'hidden', background: 'var(--color-background-strong)' }}>
          <div style={{ padding: 24, borderRight: '1px solid var(--color-border-extra-weak)', display: 'flex', alignItems: 'center', gap: 13 }}>
            <img className="gh-ico" src="/assets/logo-github-icon.svg" width="22" height="22" alt="" style={{ display: 'block', flexShrink: 0 }} />
            <div><div style={{ fontSize: 24, fontWeight: 740, letterSpacing: '-0.03em' }}>4.2k</div><div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-main-tertiary)', marginTop: 1 }}>GitHub stars</div></div>
          </div>
          <div style={{ padding: 24, borderRight: '1px solid var(--color-border-extra-weak)' }}>
            <div style={{ fontSize: 24, fontWeight: 740, letterSpacing: '-0.03em' }}>1,200+</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-main-tertiary)', marginTop: 1 }}>Icons, growing weekly</div>
          </div>
          <div style={{ padding: 24, borderRight: '1px solid var(--color-border-extra-weak)' }}>
            <div style={{ fontSize: 24, fontWeight: 740, letterSpacing: '-0.03em' }}>MIT</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-main-tertiary)', marginTop: 1 }}>Free for any project</div>
          </div>
          <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-blue-alpha-25)', color: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
            </span>
            <div><div style={{ fontSize: 15, fontWeight: 680, letterSpacing: '-0.01em' }}>Open source</div><div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-main-tertiary)', marginTop: 1 }}>Built in the open</div></div>
          </div>
        </div>
      </section>

      {/* ── WHY SOME ICONS ── */}
      <section id="why" style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 24px 64px' }}>
        <div style={{ maxWidth: 680, marginBottom: 44 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-blue-600)' }}>Why Some Icons</span>
          <h2 style={{ fontSize: 'clamp(30px,3.8vw,42px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 12 }}>Not the most icons. The most consistent.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.55, color: 'var(--color-main-secondary)', marginTop: 16 }}>Most sets win on count. Some Icons wins on cohesion — every glyph shares one grid, one stroke, and one optical rhythm, so nothing looks out of place.</p>
        </div>
        <div style={{ border: '1px solid var(--color-border-base)', borderRadius: 18, overflow: 'hidden', background: 'var(--color-background-strong)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr' }}>
            <div style={{ padding: '18px 22px', fontSize: 13, fontWeight: 600, color: 'var(--color-main-tertiary)' }}>Compared to typical icon sets</div>
            <div style={{ padding: '18px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--color-blue-alpha-25)', borderLeft: '1px solid var(--color-border-extra-weak)', borderRight: '1px solid var(--color-border-extra-weak)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 700, color: 'var(--color-blue-700)', letterSpacing: '-0.01em' }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
                </span>
                Some Icons
              </span>
            </div>
            <div style={{ padding: '18px 16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--color-main-tertiary)' }}>Typical sets</div>
          </div>
          {compareRows.map(row => (
            <div key={row.key} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', borderTop: '1px solid var(--color-border-extra-weak)' }}>
              <div style={{ padding: '18px 22px' }}>
                <div style={{ fontSize: 15, fontWeight: 650, letterSpacing: '-0.01em' }}>{row.title}</div>
                <div style={{ fontSize: 13, fontWeight: 450, color: 'var(--color-main-tertiary)', marginTop: 3 }}>{row.desc}</div>
              </div>
              <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-blue-alpha-25)', borderLeft: '1px solid var(--color-border-extra-weak)', borderRight: '1px solid var(--color-border-extra-weak)' }}>
                <CheckYes />
              </div>
              <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {row.them}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BUILT ON ONE GRID ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ border: '1px solid var(--color-border-base)', borderRadius: 24, background: 'var(--color-background-strong)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.92fr' }}>
            <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-blue-600)' }}>One grid</span>
              <h2 style={{ fontSize: 'clamp(28px,3.2vw,38px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 12 }}>Every icon, drawn on the same 24px grid.</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--color-main-secondary)', marginTop: 16, maxWidth: '46ch' }}>Shared keylines, a fixed 2px live margin, and one 1.5px stroke weight mean icons line up and feel balanced next to each other — no eyeballing, no mismatched corners.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
                {[
                  { dot: 'var(--color-blue-400)', label: '24px canvas' },
                  { dot: 'var(--color-green-500)', label: '1.5px stroke' },
                  { dot: 'var(--color-purple-500)', label: '2px live margin' },
                  { dot: 'var(--color-orange-500)', label: 'Optical center' },
                ].map(t => (
                  <span key={t.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 9999, border: '1px solid var(--color-border-weak)', fontSize: 12.5, fontWeight: 600, color: 'var(--color-main-secondary)' }}>
                    <span style={{ width: 7, height: 7, borderRadius: 9999, background: t.dot }} />{t.label}
                  </span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 8, marginTop: 30, maxWidth: 420 }}>
                {gridIds.map((id, i) => (
                  <button key={id} onClick={() => setGridIdx(i)} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', border: `1px solid ${i === gridIdx ? 'var(--color-intent-accent)' : 'var(--color-border-extra-weak)'}`, background: i === gridIdx ? 'var(--color-blue-alpha-25)' : 'transparent', color: i === gridIdx ? 'var(--color-blue-600)' : 'var(--color-main-secondary)', fontFamily: 'inherit' }}>
                    <CdnSvgIcon ic={iconById(id)} files={cdnFiles.get(id)} size={26} />
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--color-background-weak)', borderLeft: '1px solid var(--color-border-extra-weak)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 44px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 380, aspectRatio: '1/1' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 6, backgroundImage: 'linear-gradient(var(--color-border-extra-weak) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-extra-weak) 1px, transparent 1px)', backgroundSize: 'calc(100%/24) calc(100%/24)', backgroundPosition: '-1px -1px' }} />
                <div style={{ position: 'absolute', inset: '8.33%', border: '1px solid var(--color-blue-alpha-50)', borderRadius: 2 }} />
                <div style={{ position: 'absolute', inset: '8.33%', border: '1px solid var(--color-blue-alpha-50)', borderRadius: 9999 }} />
                <div style={{ position: 'absolute', top: '8.33%', bottom: '8.33%', left: '20.8%', right: '20.8%', border: '1px solid var(--color-blue-alpha-50)', borderRadius: 3 }} />
                <div style={{ position: 'absolute', left: '8.33%', right: '8.33%', top: '20.8%', bottom: '20.8%', border: '1px solid var(--color-blue-alpha-50)', borderRadius: 3 }} />
                <div style={{ position: 'absolute', left: '50%', top: '6%', bottom: '6%', width: 1, background: 'var(--color-blue-alpha-50)', transform: 'translateX(-0.5px)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '6%', right: '6%', height: 1, background: 'var(--color-blue-alpha-50)', transform: 'translateY(-0.5px)' }} />
                <div style={{ position: 'absolute', inset: '8.33%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue-600)' }}>
                  <CdnSvgIcon ic={gridIc} files={cdnFiles.get(gridIc?.id ?? '')} size="100%" color="var(--color-blue-600)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMOS ── */}
      <section id="features" style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-blue-600)' }}>See it work</span>
          <h2 style={{ fontSize: 'clamp(30px,3.8vw,42px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 12 }}>Consistency you don't have to think about.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.55, color: 'var(--color-main-secondary)', marginTop: 16 }}>Four things every icon does — try them right here, no install required.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>

          {/* outline/fill */}
          <div style={{ padding: 28, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>Outline &amp; fill, one geometry</h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--color-main-secondary)', marginTop: 6 }}>The fill is built from the exact same paths — flip without anything shifting.</p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150, margin: '16px 0', color: 'var(--color-main-primary)', background: 'var(--color-background-weak)', borderRadius: 14 }}>
              <CdnSvgIcon ic={demoIc} files={cdnFiles.get('camera')} size={104} fill={demoStyle === 'fill'} />
            </div>
            <div style={{ display: 'flex', gap: 3, padding: 2, borderRadius: 10, border: '1px solid var(--color-border-weak)', background: 'var(--color-background-input)', height: 42, alignSelf: 'flex-start' }}>
              <button onClick={() => setDemoStyle('outline')} style={segStyle(demoStyle === 'outline')}>Outline</button>
              <button onClick={() => setDemoStyle('fill')} style={segStyle(demoStyle === 'fill')}>Fill</button>
            </div>
          </div>

          {/* currentColor */}
          <div style={{ padding: 28, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>Inherits your text color</h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--color-main-secondary)', marginTop: 6 }}>Every glyph is normalized to <code style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.86em', padding: '1px 5px', borderRadius: 5, background: 'var(--color-background-weak)' }}>currentColor</code>. Set <code style={{ fontFamily: 'ui-monospace,monospace', fontSize: '0.86em', padding: '1px 5px', borderRadius: 5, background: 'var(--color-background-weak)' }}>color</code> and it follows.</p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150, margin: '16px 0', background: 'var(--color-background-weak)', borderRadius: 14 }}>
              <CdnSvgIcon ic={heartIc} files={cdnFiles.get('heart')} size={96} fill color={demoColor} />
            </div>
            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
              {colorOpts.map((c, i) => (
                <button key={c.label} onClick={() => setDemoColorIdx(i)} aria-label={`Set color ${c.label}`} style={{ width: 28, height: 28, borderRadius: 8, cursor: 'pointer', padding: 0, background: c.val, border: `2px solid ${i === demoColorIdx ? 'var(--color-main-primary)' : 'transparent'}`, boxShadow: '0 0 0 1px var(--color-border-weak) inset' }} />
              ))}
            </div>
          </div>

          {/* small sizes */}
          <div style={{ padding: 28, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>Pixel-tuned down to 12px</h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--color-main-secondary)', marginTop: 6 }}>Stays legible and crisp at the small sizes UI actually uses.</p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 26, minHeight: 150, margin: '16px 0', background: 'var(--color-background-weak)', borderRadius: 14, color: 'var(--color-main-primary)', padding: '0 16px' }}>
              {[12, 16, 20, 24, 32].map(s => (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingBottom: 16 }}>
                  <CdnSvgIcon ic={sizeIc} files={cdnFiles.get('settings')} size={s} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-main-tertiary)' }}>{s}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* clean SVG */}
          <div style={{ minWidth: 0, padding: 28, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>Clean SVG, one click</h3>
            <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--color-main-secondary)', marginTop: 6 }}>No clutter, no nested groups — just a tidy 24×24 path ready to paste.</p>
            <pre style={{ flex: 1, minWidth: 0, margin: '16px 0', padding: 16, borderRadius: 14, background: 'var(--color-gray-990)', color: 'var(--color-white-alpha-700)', fontFamily: "ui-monospace,'SF Mono',monospace", fontSize: 11.5, lineHeight: 1.6, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 150 }}>{svgCode}</pre>
            <button onClick={() => copyDemoSvg()} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, border: '1px solid var(--color-gray-950)', backgroundImage: 'var(--button-gradient-primary)', color: 'var(--color-main-inverse-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {svgCopied ? 'Copied' : 'Copy SVG'}
            </button>
          </div>

        </div>
      </section>

      {/* ── INSTALL ── */}
      <section id="install" style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-blue-600)' }}>Drop it in</span>
          <h2 style={{ fontSize: 'clamp(30px,3.8vw,42px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 12 }}>In your project in one line.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16, alignItems: 'stretch' }}>
          <div style={{ border: '1px solid var(--color-gray-950)', borderRadius: 18, background: 'var(--color-gray-990)', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#ff5f57' }} />
              <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#febc2e' }} />
              <span style={{ width: 11, height: 11, borderRadius: 9999, background: '#28c840' }} />
            </div>
            <div style={{ fontFamily: "ui-monospace,'SF Mono',monospace", fontSize: 13.5, lineHeight: 1.9 }}>
              <div style={{ color: 'var(--color-white-alpha-300)' }}># 1 · install the package</div>
              <div><span style={{ color: '#67eaf5' }}>npm</span> <span style={{ color: 'var(--color-white-alpha-700)' }}>install some-icons</span></div>
              <div style={{ height: 14 }} />
              <div style={{ color: 'var(--color-white-alpha-300)' }}># 2 · import only what you ship</div>
              <div><span style={{ color: '#b785fb' }}>import</span> <span style={{ color: 'var(--color-white-alpha-700)' }}>{'{ Camera, Heart }'}</span> <span style={{ color: '#b785fb' }}>from</span> <span style={{ color: '#65e0bb' }}>'some-icons'</span></div>
              <div style={{ height: 14 }} />
              <div style={{ color: 'var(--color-white-alpha-300)' }}># 3 · render — size &amp; color via props/CSS</div>
              <div style={{ color: 'var(--color-white-alpha-700)' }}>&lt;<span style={{ color: '#66b6ff' }}>Heart</span> <span style={{ color: '#67eaf5' }}>size</span>=<span style={{ color: '#65e0bb' }}>{'{20}'}</span> <span style={{ color: '#67eaf5' }}>fill</span> /&gt;</div>
              <div style={{ color: 'var(--color-white-alpha-700)' }}>&lt;<span style={{ color: '#66b6ff' }}>Camera</span> <span style={{ color: '#67eaf5' }}>className</span>=<span style={{ color: '#65e0bb' }}>"text-blue-500"</span> /&gt;</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ flex: 1, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--color-blue-alpha-25)', color: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </span>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>Prefer no dependencies?</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-main-secondary)', marginTop: 7 }}>Open the browser, click any icon, and the clean SVG lands on your clipboard. Paste it straight into your markup — no package, no build step.</p>
              </div>
              <button onClick={() => scrollTo('browser')} style={{ alignSelf: 'flex-start', marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 10, border: '1px solid var(--color-border-base)', backgroundImage: 'var(--button-gradient-tertiary)', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--color-main-primary)' }}>
                Open the browser
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-blue-600)' }}>What's inside</span>
          <h2 style={{ fontSize: 'clamp(30px,3.8vw,42px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 12 }}>Coverage for the everyday.</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.55, color: 'var(--color-main-secondary)', marginTop: 16 }}>Organized into focused categories so you find the right glyph fast — and they all match.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(248px,1fr))', gap: 16 }}>
          {coverageCats.map(({ name, list }) => (
            <div key={name} style={{ padding: 22, border: '1px solid var(--color-border-base)', borderRadius: 16, background: 'var(--color-background-strong)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                <span style={{ fontSize: 15.5, fontWeight: 680, letterSpacing: '-0.01em' }}>{name}</span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--color-main-tertiary)' }}>{list.length} icons</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, color: 'var(--color-main-primary)' }}>
                {list.slice(0, 7).map(ic => (
                  <span key={ic.id} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--color-border-extra-weak)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CdnSvgIcon ic={ic} files={cdnFiles.get(ic.id)} size={22} />
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-blue-600)' }}>Where it lives</span>
          <h2 style={{ fontSize: 'clamp(30px,3.8vw,42px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.08, marginTop: 12 }}>Plugged into your tools.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <div style={{ padding: 28, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--color-background-weak)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/logo-figma-icon.svg" width="22" height="22" alt="" />
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 9999, background: 'var(--color-green-alpha-25)', color: 'var(--color-green-700)', fontSize: 12, fontWeight: 650 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--color-green-500)' }} />Available
              </span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>Figma plugin</h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-main-secondary)', marginTop: 7 }}>Search the full set and drop any icon onto a frame — outline or fill, sized to your layers.</p>
            <a href="https://www.figma.com/community/plugin/some-icons" style={{ marginTop: 20, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, border: '1px solid var(--color-border-base)', backgroundImage: 'var(--button-gradient-tertiary)', fontSize: 14, fontWeight: 600 }}>
              Get the plugin
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          </div>
          <div style={{ padding: 28, border: '1px solid var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-strong)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--color-background-weak)', color: 'var(--color-main-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 9999, background: 'var(--color-green-alpha-25)', color: 'var(--color-green-700)', fontSize: 12, fontWeight: 650 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--color-green-500)' }} />Available
              </span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em' }}>React package</h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-main-secondary)', marginTop: 7 }}>Import only the icons you use — props for size, color and fill.</p>
            <button onClick={() => scrollTo('install')} style={{ marginTop: 20, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, border: '1px solid var(--color-border-base)', backgroundImage: 'var(--button-gradient-tertiary)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--color-main-primary)' }}>
              See install
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </button>
          </div>
          <div style={{ position: 'relative', padding: 28, border: '1px dashed var(--color-border-base)', borderRadius: 18, background: 'var(--color-background-weak)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--color-background-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.55 }}>
                <img src="/assets/logo-framer-icon.svg" width="22" height="22" alt="" />
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 9999, background: 'var(--color-background-strong)', border: '1px solid var(--color-border-weak)', color: 'var(--color-main-tertiary)', fontSize: 12, fontWeight: 650 }}>
                <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--color-yellow-500)' }} />Coming soon
              </span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 680, letterSpacing: '-0.01em', color: 'var(--color-main-secondary)' }}>Framer plugin</h3>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-main-tertiary)', marginTop: 7 }}>Insert icons as code components, fully styleable on the canvas. In the works.</p>
            <span style={{ marginTop: 20, alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 9, border: '1px solid var(--color-border-weak)', background: 'transparent', fontSize: 14, fontWeight: 600, color: 'var(--color-main-tertiary)' }}>Notify me</span>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ position: 'relative', borderRadius: 24, background: 'var(--color-gray-990)', padding: '72px 32px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 520, height: 300, maxWidth: '90%', background: 'radial-gradient(ellipse at center, var(--color-blue-alpha-50), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 740, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--color-gray-10)', maxWidth: '16ch', marginBottom: 18 }}>Designed to disappear into your UI.</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.5, color: 'var(--color-white-alpha-600)', maxWidth: 480, marginBottom: 32 }}>No sign-up, no paywall. Open the app, search, and copy the icon you need — it'll just fit.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <a href="https://icons.someicons.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 26px', borderRadius: 10, background: 'var(--color-gray-10)', color: 'var(--color-gray-990)', fontSize: 15, fontWeight: 650 }}>
                Open the app
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </a>
              <a href="https://github.com/seaham0606/some-icons" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 10, border: '1px solid var(--color-white-alpha-150)', color: 'var(--color-gray-10)', fontSize: 15, fontWeight: 600 }}>
                <img src="/assets/logo-github-icon.svg" width="17" height="17" alt="" style={{ filter: 'invert(1)' }} />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--color-border-extra-weak)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '30px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--color-blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Some Icons</span>
            <span style={{ fontSize: 13, color: 'var(--color-main-tertiary)', marginLeft: 6 }}>MIT licensed · made for makers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--color-main-secondary)' }}>
            <a href="https://icons.someicons.com" style={{ padding: '8px 14px', borderRadius: 9 }}>App</a>
            <a href="https://github.com/seaham0606/some-icons" style={{ padding: '8px 14px', borderRadius: 9 }}>GitHub</a>
            <a href="https://www.npmjs.com/package/some-icons" style={{ padding: '8px 14px', borderRadius: 9 }}>npm</a>
            <a href="https://www.figma.com/community/plugin/some-icons" style={{ padding: '8px 14px', borderRadius: 9 }}>Figma</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
