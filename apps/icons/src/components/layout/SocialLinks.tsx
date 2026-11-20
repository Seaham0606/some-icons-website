import figmaIcon from '../../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../../assets/images/logo-github-icon.svg'
import { trackExternalLink, type ExternalLinkLocation } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const FIGMA_URL =
  'https://www.figma.com/community/plugin/1581870303104890341/some-icons'
const GITHUB_URL = 'https://github.com/Seaham0606/some-icons-cdn'

export interface SocialLinksProps {
  location: ExternalLinkLocation
  variant?: 'footer' | 'sidebar'
  className?: string
}

export function SocialLinks({
  location,
  variant = 'footer',
  className,
}: SocialLinksProps) {
  const isSidebar = variant === 'sidebar'

  return (
    <div
      className={cn(
        isSidebar ? 'ds-sidebar__social' : 'ds-siteFooter__social',
        className,
      )}
      aria-label="Social links"
    >
      <a
        href={FIGMA_URL}
        target="_blank"
        rel="noreferrer"
        className={isSidebar ? 'ds-sidebar__socialLink' : 'ds-siteFooter__socialLink'}
        aria-label="Figma community plugin"
        onClick={() => trackExternalLink({ destination: 'figma', location })}
      >
        <img
          src={figmaIcon}
          alt={isSidebar ? 'Figma' : ''}
          width={isSidebar ? undefined : 24}
          height={isSidebar ? undefined : 24}
          className={isSidebar ? 'ds-sidebar__socialIconImg' : 'ds-siteFooter__socialImg'}
        />
      </a>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className={isSidebar ? 'ds-sidebar__socialLink' : 'ds-siteFooter__socialLink'}
        aria-label="GitHub repository"
        onClick={() => trackExternalLink({ destination: 'github', location })}
      >
        <span
          aria-hidden="true"
          className={
            isSidebar ? 'ds-sidebar__socialIconMask' : 'ds-siteFooter__socialMask'
          }
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
  )
}
