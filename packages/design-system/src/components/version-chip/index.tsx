"use client"

import { cn } from "../../utils"

export type VersionChipVariant = "default" | "beta"

export interface VersionChipProps {
  version: string
  /**
   * `default` shows the normalized semver; `beta` shows the static label “Beta” (release line still driven by `version` for a11y / future use).
   */
  variant?: VersionChipVariant
  className?: string
}

/** Strips a conventional semver "v" prefix so display stays consistent across sources (package.json, git tags, etc.). */
function displayVersion(version: string): string {
  return version.trim().replace(/^v(?=\d)/i, "")
}

export function VersionChip({ version, variant = "default", className }: VersionChipProps) {
  const normalized = displayVersion(version)
  const isBeta = variant === "beta"
  const label = isBeta ? "Beta" : normalized
  const ariaLabel = isBeta ? `Beta, version ${normalized}` : `Version ${normalized}`

  return (
    <span
      className={cn("ds-versionChip label-3xs", className)}
      data-variant={variant}
      aria-label={ariaLabel}
    >
      {label}
    </span>
  )
}

