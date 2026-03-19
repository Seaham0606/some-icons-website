"use client"

import * as React from "react"
import { cn } from "../../utils"
import { VersionChip } from "../version-chip"

export interface SidebarProps {
  className?: string
  children?: React.ReactNode

  /**
   * Page label shown in `asideHeader`.
   * Set to whatever you need (e.g. string or element).
   */
  pageName?: React.ReactNode

  /**
   * Version string shown as a chip next to `pageName` (e.g. "v3.0.0").
   * If omitted, no chip is rendered.
   */
  version?: string

  /**
   * Logo placeholder shown in `asideHeader`.
   * If omitted, a square placeholder is rendered.
   */
  logo?: React.ReactNode

  /**
   * Theme button shown in `asideHeader`.
   * If omitted, a square button placeholder is rendered.
   */
  themeButton?: React.ReactNode

  /**
   * Copyright shown in `asideFooter`.
   * If omitted, a simple `© <year>` placeholder is rendered.
   */
  copyright?: React.ReactNode

  /**
   * Social buttons shown in `asideFooter`.
   * If omitted, two square placeholder buttons are rendered.
   */
  socialButtons?: React.ReactNode
}

function DefaultSquarePlaceholder({
  "aria-label": ariaLabel,
}: {
  "aria-label": string
}) {
  return <div className="ds-sidebar__squareAssetPlaceholder" aria-label={ariaLabel} />
}

function DefaultThemeButton() {
  return (
    <button
      type="button"
      className="ds-sidebar__squareButtonPlaceholder"
      aria-label="Theme"
    />
  )
}

function DefaultSocialButtons() {
  return (
    <div className="ds-sidebar__socialButtons" aria-label="Social buttons">
      <button
        type="button"
        className="ds-sidebar__squareButtonPlaceholder"
        aria-label="Social placeholder 1"
      />
      <button
        type="button"
        className="ds-sidebar__squareButtonPlaceholder"
        aria-label="Social placeholder 2"
      />
    </div>
  )
}

export function Sidebar({
  className,
  children,
  pageName = "Page Name",
  version,
  logo,
  themeButton,
  copyright,
  socialButtons,
}: SidebarProps) {
  const asideHeader = (
    <div className="ds-sidebar__asideHeader" data-slot="asideHeader">
      {logo ?? <DefaultSquarePlaceholder aria-label="Logo placeholder" />}

      <div className="ds-sidebar__pageName" data-slot="pageName">
        {pageName}
      </div>

      {version ? <VersionChip version={version} /> : null}

      {themeButton ?? <DefaultThemeButton />}
    </div>
  )

  const contentSlot = (
    <div className="ds-sidebar__contentSlot" data-slot="contentSlot">
      {children}
    </div>
  )

  const year = new Date().getFullYear()
  const asideFooter = (
    <div className="ds-sidebar__asideFooter" data-slot="asideFooter">
      <div className="ds-sidebar__copyright label-sm" data-slot="copyright">
        {copyright ?? `© ${year} Some UI`}
      </div>
      {socialButtons ?? <DefaultSocialButtons />}
    </div>
  )

  return (
    <aside className={cn("ds-sidebar", className)} data-slot="sidebar">
      {asideHeader}
      {contentSlot}
      {asideFooter}
    </aside>
  )
}

