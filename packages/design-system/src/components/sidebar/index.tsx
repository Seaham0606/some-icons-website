"use client"

import * as React from "react"
import { cn } from "../../utils"
import { Button } from "../button"
import { VersionChip, type VersionChipVariant } from "../version-chip"

export interface SidebarProps {
  className?: string
  children?: React.ReactNode

  /**
   * Page label in the header title row (next to the version chip).
   * Omit for a logo-only header row (unusual).
   */
  pageName?: React.ReactNode

  /**
   * Version string shown as a chip next to `pageName` (e.g. "3.0.0"; a leading "v" is stripped for display).
   * If omitted, no chip is rendered.
   */
  version?: string

  /** Passed to `VersionChip` (e.g. `beta` shows “Beta” while `version` still supplies the release line). */
  versionChipVariant?: VersionChipVariant

  /**
   * Logo placeholder shown in `asideHeader`.
   * If omitted, a square placeholder is rendered.
   */
  logo?: React.ReactNode

  /**
   * Theme button shown in `asideHeader`.
   * If omitted, a default transparent icon `Button` is rendered (same pattern as the icons app header).
   */
  themeButton?: React.ReactNode

  /**
   * Copyright shown in `asideFooter`.
   * If omitted, a simple `© <year>` placeholder is rendered.
   */
  copyright?: React.ReactNode

  /** 
   * Social buttons shown in `asideFooter`.
   * If omitted, two default transparent icon `Button`s are rendered as placeholders (override with real links/icons in apps).
   */
  socialButtons?: React.ReactNode
}

function DefaultLogoPlaceholder({
  "aria-label": ariaLabel,
}: {
  "aria-label": string
}) {
  return (
    <div
      className="ds-sidebar__logoPlaceholder"
      aria-label={ariaLabel}
      role="img"
    />
  )
}

function DefaultThemeButton() {
  return (
    <Button
      type="button"
      variant="transparent"
      size="md"
      aria-label="Theme"
      iconName="weather-moon"
      iconStyle="fill"
      contentColor="var(--color-main-tertiary)"
    />
  )
}

function DefaultSocialButtons() {
  return (
    <div className="ds-sidebar__social" aria-label="Social links">
      <Button
        type="button"
        variant="transparent"
        size="md"
        aria-label="Social placeholder 1"
        iconName="formatting-pencil-alt"
        iconStyle="outline"
        contentColor="var(--color-main-tertiary)"
      />
      <Button
        type="button"
        variant="transparent"
        size="md"
        aria-label="Social placeholder 2"
        iconName="arrow-up-out"
        iconStyle="outline"
        contentColor="var(--color-main-tertiary)"
      />
    </div>
  )
}

export function Sidebar({
  className,
  children,
  pageName,
  version,
  versionChipVariant = "default",
  logo,
  themeButton,
  copyright,
  socialButtons,
}: SidebarProps) {
  const asideHeader = (
    <div className="ds-sidebar__asideHeader" data-slot="asideHeader">
      <div className="ds-sidebar__headerGroup" data-slot="headerGroup">
        {logo ?? <DefaultLogoPlaceholder aria-label="Logo placeholder" />}
        <div className="ds-sidebar__titleBlock" data-slot="titleBlock">
          {pageName != null && pageName !== "" ? (
            <div className="ds-sidebar__pageName" data-slot="pageName">
              {pageName}
            </div>
          ) : null}
          {version ? (
            <VersionChip version={version} variant={versionChipVariant} />
          ) : null}
        </div>
      </div>

      {themeButton ?? <DefaultThemeButton />}
    </div>
  )

  const contentSlot = (
    <div className="ds-sidebar__contentSlot" data-slot="contentSlot">
      {children ?? null}
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

