import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MainContent, ScrollArea } from '@/components/layout/MainContent'
import { ChangelogEntry } from '@/components/changelog/ChangelogEntry'
import { useChangelog } from '@/hooks/useChangelog'
import { useUIStore } from '@/stores/uiStore'
import { SomeIcon } from 'design-system'
import figmaLogo from '../../assets/images/logo-figma-icon.svg'

function ChangelogFooter() {
  const currentYear = new Date().getFullYear()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(theme === 'dark' || (!theme && prefersDark))
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', checkTheme)
    }
  }, [])

  return (
    <footer
      id="main-footer"
      className="
        absolute bottom-0 left-0 right-0 z-50
        border-t border-[var(--color-border-base)]
        bg-[var(--background-footer)] backdrop-blur-[10px]
        px-4 py-3 sm:px-6 sm:py-4
      "
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[var(--foreground-quaternary)]">
        <div className="flex items-center gap-6">
          <span>&copy; {currentYear} Sihan Liu</span>
          <a
            href="https://choosealicense.com/licenses/mit/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-main-primary)] transition-colors"
          >
            License
          </a>
        </div>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <a
            href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-main-primary)] transition-colors"
            aria-label="Some Icons Figma plugin"
          >
            <img src={figmaLogo} alt="Figma" className="h-6 w-6" />
          </a>
          <a
            href="https://github.com/Seaham0606/some-icons-cdn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-main-primary)] transition-colors"
            aria-label="Some Icons GitHub repository"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{
                color: isDark
                  ? 'var(--color-white-alpha-800)'
                  : 'var(--color-black-alpha-800)',
              }}
            >
              <path
                d="M12 1C5.923 1 1 5.923 1 12C1 16.867 4.149 20.979 8.521 22.436C9.071 22.532 9.277 22.203 9.277 21.914C9.277 21.652 9.264 20.786 9.264 19.865C6.5 20.374 5.785 19.191 5.565 18.573C5.441 18.256 4.905 17.28 4.438 17.019C4.053 16.812 3.502 16.304 4.424 16.29C5.29 16.276 5.909 17.087 6.115 17.418C7.105 19.081 8.686 18.614 9.319 18.325C9.415 17.61 9.704 17.129 10.02 16.854C7.572 16.579 5.015 15.63 5.015 11.422C5.015 10.226 5.441 9.236 6.143 8.466C6.032 8.191 5.647 7.064 6.253 5.551C6.253 5.551 7.174 5.263 9.277 6.679C10.1725 6.43055 11.0977 6.30573 12.027 6.308C12.963 6.308 13.898 6.431 14.777 6.679C16.881 5.249 17.802 5.551 17.802 5.551C18.407 7.064 18.023 8.191 17.913 8.466C18.614 9.236 19.04 10.213 19.04 11.422C19.04 15.644 16.469 16.579 14.021 16.854C14.42 17.198 14.764 17.858 14.764 18.889C14.764 20.36 14.75 21.543 14.75 21.914C14.75 22.203 14.956 22.546 15.506 22.436C19.851 20.979 23 16.854 23 12C23 5.923 18.078 1 12 1Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

function ChangelogMobileHeader() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-base)] bg-[var(--color-background-elevation)]">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
        >
          <SomeIcon
            iconName="arrow-left-triangle"
            iconStyle="outline"
            iconSize="xs"
            padding="0"
          />
        </Link>
        <img src="/favicon.png" alt="Some Icons" className="w-6 h-6" />
        <h1 className="font-semibold text-[var(--color-main-primary)]">Changelog</h1>
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 -mr-2 text-[var(--color-main-secondary)] hover:text-[var(--color-main-primary)] transition-colors"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {sidebarOpen ? (
          <SomeIcon iconName="arrow-up-triangle" iconStyle="outline" iconSize="md" padding="0" />
        ) : (
          <SomeIcon iconName="arrow-down-triangle" iconStyle="outline" iconSize="md" padding="0" />
        )}
      </button>
    </header>
  )
}

export default function ChangelogPage() {
  const { data: entries, isLoading, error } = useChangelog()

  return (
    <div className="flex flex-col h-dvh">
      <ChangelogMobileHeader />

      <MainContent>
        <ScrollArea className="p-6 max-sm:p-4">
          {isLoading ? (
            <div className="text-[var(--color-main-secondary)]">Loading changelog...</div>
          ) : error ? (
            <div className="text-[var(--color-red-400)]">
              Failed to load changelog. Please try again.
            </div>
          ) : entries && entries.length > 0 ? (
            <div className="max-w-2xl space-y-12">
              {entries.map((entry) => (
                <ChangelogEntry key={entry.anchorId} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-[var(--color-main-secondary)]">No changelog entries found.</div>
          )}
        </ScrollArea>
        <ChangelogFooter />
      </MainContent>
    </div>
  )
}
