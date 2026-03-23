"use client"

import { cn } from "../../utils"

export interface VersionChipProps {
  version: string
  className?: string
}

/** Strips a conventional semver "v" prefix so display stays consistent across sources (package.json, git tags, etc.). */
function displayVersion(version: string): string {
  return version.trim().replace(/^v(?=\d)/i, "")
}

export function VersionChip({ version, className }: VersionChipProps) {
  const text = displayVersion(version)

  return (
    <span className={cn("ds-versionChip label-3xs", className)} aria-label="Version">
      {text}
    </span>
  )
}

