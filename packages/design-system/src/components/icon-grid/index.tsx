"use client"

import * as React from "react"
import { cn } from "../../utils"

export interface IconGridProps {
  className?: string
  style?: React.CSSProperties
  isLoading?: boolean
  hasError?: boolean
  /** When true and not loading/error, shows the empty state instead of `children`. */
  isEmpty?: boolean
  /** Optional bottom padding in pixels (e.g. clearance for a fixed footer). */
  paddingBottomPx?: number
  loadingMessage?: React.ReactNode
  errorMessage?: React.ReactNode
  emptyMessage?: React.ReactNode
  children?: React.ReactNode
}

export function IconGrid({
  className,
  style,
  isLoading = false,
  hasError = false,
  isEmpty = false,
  paddingBottomPx,
  loadingMessage = "Loading icons...",
  errorMessage = "Failed to load icons. Please try again.",
  emptyMessage = "No icons found matching your criteria.",
  children,
}: IconGridProps) {
  const bottomStyle: React.CSSProperties | undefined =
    paddingBottomPx != null && paddingBottomPx > 0
      ? { paddingBottom: `${paddingBottomPx}px` }
      : undefined

  const mergedStyle: React.CSSProperties | undefined =
    bottomStyle != null || style != null
      ? { ...style, ...bottomStyle }
      : style

  if (isLoading) {
    return (
      <div
        className={cn("ds-iconGrid__message", className)}
        style={mergedStyle}
        role="status"
        aria-busy="true"
      >
        {loadingMessage}
      </div>
    )
  }

  if (hasError) {
    return (
      <div
        className={cn(
          "ds-iconGrid__message",
          "ds-iconGrid__message--error",
          className
        )}
        style={mergedStyle}
        role="alert"
      >
        {errorMessage}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={cn("ds-iconGrid__message", className)} style={mergedStyle}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={cn("ds-iconGrid", className)} style={mergedStyle}>
      {children}
    </div>
  )
}
