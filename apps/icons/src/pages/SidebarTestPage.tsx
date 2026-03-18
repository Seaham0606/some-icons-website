import {
  Sidebar,
  SidebarAsideHeader,
  SidebarContentSlot,
  SidebarAsideFooter,
} from 'design-system'
import { useUIStore } from '@/stores/uiStore'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaLogo from '../../assets/images/logo-figma-icon.svg'

export default function SidebarTestPage() {
  const [open, setOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const setTheme = useUIStore((state) => state.setTheme)
  const effectiveTheme = useUIStore((state) => state.getEffectiveTheme())
  const isDark = effectiveTheme === 'dark'

  return (
    <div
      className="flex flex-col md:flex-row h-dvh w-full"
      style={{ backgroundColor: 'var(--color-fill-background-base)' }}
    >
      {/* Mobile open button */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] px-3 py-1.5 rounded-lg text-sm font-semibold"
        style={{ backgroundColor: 'var(--color-main-primary)', color: 'var(--color-main-inverse)' }}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Open'} sidebar
      </button>

      <Sidebar open={open} onOpenChange={setOpen}>

        {/* ── asideHeader ── */}
        <SidebarAsideHeader>
          {/* Logo + title + version */}
          <div className="flex gap-3 items-center">
            <img src={logoSymbol} alt="Some Icons" className="size-7 shrink-0" />
            <div className="flex gap-3 items-end">
              <span
                className="text-[21px] font-semibold leading-none whitespace-nowrap"
                style={{ color: 'var(--color-main-primary)' }}
              >
                Icon library
              </span>
              <div
                className="rounded-full px-2 pt-1 pb-[5px] shrink-0"
                style={{ backgroundColor: 'var(--color-fill-overlay-weak)' }}
              >
                <span
                  className="text-[10px] font-semibold leading-none"
                  style={{ color: 'var(--color-main-tertiary)' }}
                >
                  v3.0.0
                </span>
              </div>
            </div>
          </div>

          {/* Theme toggle icon button */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex items-center justify-center size-9 rounded-md transition-colors"
            style={{ color: 'var(--color-main-primary)' }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </SidebarAsideHeader>

        {/* ── contentSlot ── */}
        <SidebarContentSlot>
          <div className="h-full rounded-lg" style={{ backgroundColor: 'var(--color-red-alpha-25)' }} />
        </SidebarContentSlot>

        {/* ── asideFooter ── */}
        <SidebarAsideFooter>
          <span className="text-sm" style={{ color: 'var(--color-main-tertiary)' }}>
            © {currentYear} Sihan Liu
          </span>

          <div className="flex items-center gap-3">
            <a
              href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Some Icons Figma plugin"
            >
              <img src={figmaLogo} alt="Figma" className="size-5" />
            </a>
            <a
              href="https://github.com/Seaham0606/some-icons-cdn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Some Icons GitHub repository"
              style={{ color: 'var(--color-main-secondary)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M12 1C5.923 1 1 5.923 1 12C1 16.867 4.149 20.979 8.521 22.436C9.071 22.532 9.277 22.203 9.277 21.914C9.277 21.652 9.264 20.786 9.264 19.865C6.5 20.374 5.785 19.191 5.565 18.573C5.441 18.256 4.905 17.28 4.438 17.019C4.053 16.812 3.502 16.304 4.424 16.29C5.29 16.276 5.909 17.087 6.115 17.418C7.105 19.081 8.686 18.614 9.319 18.325C9.415 17.61 9.704 17.129 10.02 16.854C7.572 16.579 5.015 15.63 5.015 11.422C5.015 10.226 5.441 9.236 6.143 8.466C6.032 8.191 5.647 7.064 6.253 5.551C6.253 5.551 7.174 5.263 9.277 6.679C10.1725 6.43055 11.0977 6.30573 12.027 6.308C12.963 6.308 13.898 6.431 14.777 6.679C16.881 5.249 17.802 5.551 17.802 5.551C18.407 7.064 18.023 8.191 17.913 8.466C18.614 9.236 19.04 10.213 19.04 11.422C19.04 15.644 16.469 16.579 14.021 16.854C14.42 17.198 14.764 17.858 14.764 18.889C14.764 20.36 14.75 21.543 14.75 21.914C14.75 22.203 14.956 22.546 15.506 22.436C19.851 20.979 23 16.854 23 12C23 5.923 18.078 1 12 1Z" />
              </svg>
            </a>
          </div>
        </SidebarAsideFooter>

      </Sidebar>

      {/* Main content placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm" style={{ color: 'var(--color-main-tertiary)' }}>
          Main content area
        </span>
      </div>
    </div>
  )
}
