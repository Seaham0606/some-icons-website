"use client"

import type { ReactNode } from 'react'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import framerIcon from '../../assets/images/logo-framer-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import { cn } from '../../utils'

function DefaultSomeIconsSocialRow() {
  return (
    <div className="ds-siteFooter__social" aria-label="Social links">
      <a
        href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
        target="_blank"
        rel="noreferrer"
        className="ds-siteFooter__socialLink"
        aria-label="Figma community plugin"
      >
        <img
          src={figmaIcon}
          alt=""
          width={24}
          height={24}
          className="ds-siteFooter__socialImg"
        />
      </a>
      <a
        href="https://www.framer.com/"
        target="_blank"
        rel="noreferrer"
        className="ds-siteFooter__socialLink"
        aria-label="Framer"
      >
        <img
          src={framerIcon}
          alt=""
          width={24}
          height={24}
          className="ds-siteFooter__socialImg"
        />
      </a>
      <a
        href="https://github.com/Seaham0606/some-icons-cdn"
        target="_blank"
        rel="noreferrer"
        className="ds-siteFooter__socialLink"
        aria-label="GitHub repository"
      >
        <span
          aria-hidden="true"
          className="ds-siteFooter__socialMask"
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
      <a
        href="https://www.npmjs.com/"
        target="_blank"
        rel="noreferrer"
        className="ds-siteFooter__npmLink label-sm"
        aria-label="npm"
      >
        npm
      </a>
    </div>
  )
}

/**
 * Site footer: copyright + optional trailing slot (default: Some Icons social row).
 * Modifiers: `ds-siteFooter--fixed`, `ds-siteFooter--inScroll`.
 */
export interface SiteFooterProps {
  className?: string
  copyright: ReactNode
  /**
   * Right side of the bar. Omit for built-in Some Icons social links.
   * Pass `null` to hide the trailing column.
   */
  trailingSlot?: ReactNode | null
}

export function SiteFooter({
  className,
  copyright,
  trailingSlot,
}: SiteFooterProps) {
  const trailing =
    trailingSlot === undefined ? (
      <DefaultSomeIconsSocialRow />
    ) : trailingSlot === null ? null : (
      trailingSlot
    )

  return (
    <footer className={cn('ds-siteFooter', className)}>
      <div className="ds-siteFooter__inner">
        <div className="ds-siteFooter__copyright label-sm">{copyright}</div>
        {trailing}
      </div>
    </footer>
  )
}
