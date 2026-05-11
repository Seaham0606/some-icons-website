"use client"

/**
 * InputField — Figma **InputWrapper** (80:5593): label + content; optional second column (gap-3, equal fill width).
 */

import * as React from "react"
import { cn } from "../../utils"
import { InputSectionSlotPlaceholder } from "../input-section"

export interface InputFieldProps {
  className?: string
  /**
   * When `false`, the label row is hidden (e.g. search with no caption).
   * When `true` (default), the row shows if `label` is a non-empty string or any other node.
   */
  showLabel?: boolean
  /** Shown above the content region when `showLabel` is true. */
  label?: React.ReactNode
  /**
   * HTML element for the label row text. Use `"label"` with `labelHtmlFor` to associate with a control `id`.
   * @default "span"
   */
  labelTag?: "span" | "label"
  /** Passed to `htmlFor` when `labelTag` is `"label"`. */
  labelHtmlFor?: string
  showContentSlot?: boolean
  /** Main control area (column 1 when `showCol2`); default empty state matches InputSection slot placeholder (Figma 115:8535). */
  contentSlot?: React.ReactNode
  /** When true, `contentSlot` and `secondarySlot` render in a row with gap-3; both columns share available width; row height follows content. @default false */
  showCol2?: boolean
  /** Second column when `showCol2` is true. */
  secondarySlot?: React.ReactNode
  /**
   * When `showCol2`, how wide column 2 is. `equal` splits the row with column 1; `size-12` fixes column 2 to `var(--size-12)` (48px) so column 1 takes the rest.
   * @default "equal"
   */
  col2Width?: "equal" | "size-10" | "size-12"
}

export function InputField({
  className,
  showLabel = true,
  label,
  labelTag = "span",
  labelHtmlFor,
  showContentSlot = true,
  contentSlot,
  showCol2 = false,
  secondarySlot,
  col2Width = "equal",
}: InputFieldProps) {
  const showLabelRow =
    showLabel && label != null && !(typeof label === "string" && label === "")

  const mainSlot = contentSlot ?? <InputSectionSlotPlaceholder />

  const LabelTag = labelTag

  return (
    <div
      className={cn("ds-inputField", className)}
      data-component="input-field"
    >
      {showLabelRow ? (
        <div className="ds-inputField__labelRow" data-part="label-row">
          <LabelTag
            className="ds-inputField__label label-xs"
            data-part="label"
            {...(LabelTag === "label" && labelHtmlFor != null
              ? { htmlFor: labelHtmlFor }
              : {})}
          >
            {label}
          </LabelTag>
        </div>
      ) : null}
      {showContentSlot ? (
        <div className="ds-inputField__content" data-part="content">
          {showCol2 ? (
            <div className="ds-inputField__row" data-part="row">
              <div
                className="ds-inputField__col ds-inputField__col--primary"
                data-part="primary"
              >
                {mainSlot}
              </div>
              <div
                className="ds-inputField__col ds-inputField__col--secondary"
                data-part="secondary"
                data-col2-width={col2Width}
              >
                {secondarySlot}
              </div>
            </div>
          ) : (
            mainSlot
          )}
        </div>
      ) : null}
    </div>
  )
}
