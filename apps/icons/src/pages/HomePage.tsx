import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import { useUIStore } from '@/stores/uiStore'
import { useEffect } from 'react'
import { InputSection, VersionChip } from 'design-system'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'

export default function HomePage() {
  const setTheme = useUIStore((state) => state.setTheme)
  const { data: entries } = useChangelog()
  const version = getHighestVersion(entries)

  // Always follow system theme when landing on this page.
  useEffect(() => {
    setTheme('system')
  }, [setTheme])

  return (
    <div className="homepage-shell">
      <aside className="homepage-aside">
        {/* asideHeader: hugs its content height */}
        <div className="homepage-asideHeader">
          <div className="homepage-asideHeaderGroup">
            <img
              src={logoSymbol}
              alt="Some Icons"
              width={28}
              height={28}
              className="homepage-logoIcon"
            />

            <div className="homepage-titleBlock">
              <div className="homepage-pageName">Some Icons</div>
              {version ? <VersionChip version={version} /> : null}
            </div>
          </div>

          <button
            type="button"
            className="homepage-themeButton"
            aria-label="Theme"
          />
        </div>

        {/* contentSlot: fills remaining available height */}
        <div className="homepage-contentSlot" data-slot="contentSlot">
          <div className="homepage-inputSections">
            <InputSection label="sidebarCard" />
            <InputSection label="filters" />
            <InputSection label="export" />
          </div>
        </div>

        {/* asideFooter: hugs its content height */}
        <div className="homepage-asideFooter">
          <div className="label-sm homepage-footerCopyright">
            © {new Date().getFullYear()} Some UI
          </div>

          {/* social icons (no wrapper border; no spacing between icons) */}
          <div className="homepage-social">
            <a
              href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
              target="_blank"
              rel="noreferrer"
              className="homepage-socialLink"
              aria-label="Figma community plugin"
            >
              <img
                src={figmaIcon}
                alt="Figma"
                className="homepage-socialIconImg"
              />
            </a>
            <a
              href="https://github.com/Seaham0606/some-icons-cdn"
              target="_blank"
              rel="noreferrer"
              className="homepage-socialLink"
              aria-label="GitHub repository"
            >
              {/* Use mask so the SVG can be tinted with --color-main-primary */}
              <span
                aria-hidden="true"
                className="homepage-socialGithubMask"
                style={{
                  backgroundColor: 'var(--color-main-primary)',
                  WebkitMaskImage: `url("${githubIcon}")`,
                  maskImage: `url("${githubIcon}")`,
                  maskMode: 'alpha',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
            </a>
          </div>
        </div>
      </aside>

      <main className="homepage-main" />
    </div>
  )
}
