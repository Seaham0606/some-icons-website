"use client"

import * as React from "react"
import { cn } from "../../utils"
import { Button } from "../button"
import { SomeIcon, type SomeIconStyle } from "../some-icon"

export interface SegmentedControlOption<T extends string | number> {
  readonly value: T
  /** Shown as the segment’s `Button` label (string or custom node from the app). */
  readonly label: React.ReactNode
  readonly leadingIcon?: string
  readonly trailingIcon?: string
}

export interface SegmentedControlProps<T extends string | number> {
  /** Accepts both mutable arrays and `as const` tuples (use `ReadonlyArray` for assignability). */
  options: ReadonlyArray<SegmentedControlOption<T>>
  value: T | null
  onChange: (value: T) => void
  className?: string
  hasError?: boolean
  /**
   * Only used when an option sets `leadingIcon` / `trailingIcon` (passed to `SomeIcon`).
   * Omit to use the design-system package default CDN base.
   */
  cdnBaseUrl?: string
  /**
   * Only used with `leadingIcon` / `trailingIcon` on options (`SomeIcon` style).
   * @default "outline"
   */
  segmentIconStyle?: SomeIconStyle
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  className,
  hasError = false,
  cdnBaseUrl,
  segmentIconStyle = "outline",
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn("ds-segmentedControl", className)}
      data-component="segmented-control"
      data-has-error={hasError ? "true" : "false"}
      role="group"
    >
      {options.map((option, index) => {
        const isSelected = value === option.value
        const showLeadingSlot = Boolean(option.leadingIcon)
        const showTrailingSlot = Boolean(option.trailingIcon)

        return (
          <React.Fragment key={String(option.value)}>
            {index > 0 ? (
              <div
                className="ds-segmentedControl__dividerWrap"
                aria-hidden
              >
                <div className="ds-segmentedControl__divider" />
              </div>
            ) : null}
            <Button
              type="button"
              variant={isSelected ? "primary" : "transparent"}
              tint={isSelected ? "inverse" : "default"}
              size="md"
              radius="md"
              fullWidth={false}
              data-segment-selected={isSelected ? "true" : "false"}
              className="ds-segmentedControl__segment min-w-0 flex-1"
              onClick={() => onChange(option.value)}
              leadingSlot={
                showLeadingSlot ? (
                  <SomeIcon
                    iconName={option.leadingIcon!}
                    iconStyle={segmentIconStyle}
                    cdnBaseUrl={cdnBaseUrl}
                  />
                ) : undefined
              }
              trailingSlot={
                showTrailingSlot ? (
                  <SomeIcon
                    iconName={option.trailingIcon!}
                    iconStyle={segmentIconStyle}
                    cdnBaseUrl={cdnBaseUrl}
                  />
                ) : undefined
              }
            >
              {option.label}
            </Button>
          </React.Fragment>
        )
      })}
    </div>
  )
}
