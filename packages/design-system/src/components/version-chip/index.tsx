"use client"

import { cn } from "../../utils"

export interface VersionChipProps {
  version: string
  className?: string
}

export function VersionChip({ version, className }: VersionChipProps) {
  const text = version.startsWith("v") ? version : `v${version}`

  return (
    <span className={cn("ds-versionChip label-3xs", className)} aria-label="Version">
      {text}
    </span>
  )
}

