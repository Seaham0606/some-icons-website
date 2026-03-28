"use client"

import * as React from "react"
import { cn } from "../../utils"
import { SomeIcon } from "../some-icon"

export interface IconCardCopyFeedbackPosition {
  x: number
  y: number
}

export interface IconCardProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    | "className"
    | "children"
    | "onClick"
    | "onMouseEnter"
    | "onMouseLeave"
  > {
  className?: string
  /** Shell wrapper (covers primary + selection control). */
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  /** Shown as the native `title` tooltip (e.g. icon id). */
  title: string
  selected?: boolean
  showSelectionControl?: boolean
  previewSlot: React.ReactNode
  onPrimaryClick?: React.MouseEventHandler<HTMLButtonElement>
  onSelectionToggleClick?: React.MouseEventHandler<HTMLButtonElement>
  /** When true, shows the floating “Copied” chip at `copyFeedbackPosition`. */
  copyFeedbackOpen?: boolean
  copyFeedbackPosition?: IconCardCopyFeedbackPosition
  /** Label next to the check icon; defaults to `"Copied"`. */
  copyFeedbackLabel?: React.ReactNode
  cdnBaseUrl?: string
}

const defaultCopyFeedbackPosition: IconCardCopyFeedbackPosition = {
  x: 0,
  y: 0,
}

export const IconCard = React.forwardRef<HTMLButtonElement, IconCardProps>(
  function IconCard(
    {
      className,
      title,
      selected = false,
      showSelectionControl = true,
      previewSlot,
      onPrimaryClick,
      onSelectionToggleClick,
      copyFeedbackOpen = false,
      copyFeedbackPosition = defaultCopyFeedbackPosition,
      copyFeedbackLabel = "Copied",
      cdnBaseUrl,
      type = "button",
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref
  ) {
    const handleSelectionClick: React.MouseEventHandler<HTMLButtonElement> = (
      e
    ) => {
      e.stopPropagation()
      onSelectionToggleClick?.(e)
    }

    const feedbackStyle: React.CSSProperties | undefined = copyFeedbackOpen
      ? {
          left: `${copyFeedbackPosition.x + 10}px`,
          top: `${copyFeedbackPosition.y + 10}px`,
        }
      : undefined

    return (
      <>
        <div
          className={cn("ds-iconCard__shell", className)}
          data-selected={selected ? "true" : undefined}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <button
            ref={ref}
            type={type}
            title={title}
            className="ds-iconCard"
            onClick={onPrimaryClick}
            {...rest}
          >
            <span className="ds-iconCard__previewWrap">
              <span className="ds-iconCard__preview">{previewSlot}</span>
            </span>
          </button>
          {showSelectionControl ? (
            <button
              type="button"
              className="ds-iconCard__select"
              onClick={handleSelectionClick}
              aria-label={selected ? "Deselect icon" : "Select icon"}
            >
              {selected ? (
                <SomeIcon
                  iconName="symbol-check-circle"
                  iconStyle="fill"
                  cdnBaseUrl={cdnBaseUrl}
                  iconSize="sm"
                  padding="0"
                />
              ) : (
                <SomeIcon
                  iconName="interface-button-radio"
                  iconStyle="outline"
                  cdnBaseUrl={cdnBaseUrl}
                  iconSize="sm"
                  padding="0"
                />
              )}
            </button>
          ) : null}
        </div>
        {copyFeedbackOpen ? (
          <div
            className="ds-iconCard__copyFeedback"
            style={feedbackStyle}
            role="status"
            aria-live="polite"
          >
            <SomeIcon
              iconName="symbol-check-mark"
              iconStyle="outline"
              cdnBaseUrl={cdnBaseUrl}
              iconSize="xs"
              padding="0"
            />
            {copyFeedbackLabel}
          </div>
        ) : null}
      </>
    )
  }
)
