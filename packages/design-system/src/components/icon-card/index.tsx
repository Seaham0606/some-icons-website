"use client"

import * as React from "react"
import { cn } from "../../utils"
import { Chip } from "../chip"
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
  /** Optional native tooltip (`title` attribute); prefer `aria-label` on the button if you only need an accessible name. */
  title?: string
  /**
   * Basename without extension (or similar); on shell hover, shown in an inverse blurred chip
   * `var(--spacing-1)` below the card.
   */
  hoverFilenameLabel?: string
  selected?: boolean
  /** Highlights the card (e.g. row opened an adjacent info panel). */
  infoActive?: boolean
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
      hoverFilenameLabel,
      selected = false,
      infoActive = false,
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
          className={cn("ds-iconCard__block", className)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div
            className="ds-iconCard__shell"
            data-selected={selected ? "true" : undefined}
            data-info-active={infoActive ? "true" : undefined}
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
                    iconName="checkbox-checked"
                    iconStyle="fill"
                    cdnBaseUrl={cdnBaseUrl}
                    iconSize="sm"
                    padding="0"
                  />
                ) : (
                  <SomeIcon
                    iconName="checkbox-unchecked"
                    iconStyle="outline"
                    cdnBaseUrl={cdnBaseUrl}
                    iconSize="sm"
                    padding="0"
                  />
                )}
              </button>
            ) : null}
          </div>
          {hoverFilenameLabel ? (
            <div className="ds-iconCard__hoverMeta" aria-hidden>
              <Chip variant="inverse" backdropBlur>
                {hoverFilenameLabel}
              </Chip>
            </div>
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
              iconName="check-mark"
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
