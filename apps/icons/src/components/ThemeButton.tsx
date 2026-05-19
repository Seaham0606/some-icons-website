import { Button, type ButtonRadius, type ButtonStateIcon } from 'design-system'

const THEME_STRIP_ICONS: [ButtonStateIcon, ButtonStateIcon] = [
  {
    iconName: 'sun',
    iconStyle: 'fill',
    color: 'var(--color-main-tertiary)',
  },
  {
    iconName: 'moon',
    iconStyle: 'fill',
    color: 'var(--color-main-tertiary)',
  },
]

export interface ThemeButtonProps {
  /**
   * Effective color appearance from the app (e.g. store + system resolution).
   * Moon when `light`, sun when `dark`.
   */
  mode: 'light' | 'dark'
  /** Parent updates persisted theme (e.g. flip between light and dark). */
  onToggle: () => void
  className?: string
  /** Passed to the underlying `Button`; controls clip shape for the icon strip. */
  radius?: ButtonRadius
  disabled?: boolean
  cdnBaseUrl?: string
  /**
   * When false, the leading icon strip snaps without scroll animation.
   * @default true
   */
  hasFeedback?: boolean
  /**
   * When true (default), `prefers-reduced-motion: reduce` disables strip animation.
   * @default true
   */
  respectReducedMotion?: boolean
}

/**
 * Icons app theme toggle: transparent icon-only `Button` with moon/sun animated strip.
 */
export function ThemeButton({
  mode,
  onToggle,
  className,
  radius = 'lg',
  disabled,
  cdnBaseUrl,
  hasFeedback = true,
  respectReducedMotion = true,
}: ThemeButtonProps) {
  const isDark = mode === 'dark'

  return (
    <Button
      type="button"
      variant="transparent"
      size="md"
      radius={radius}
      className={className}
      disabled={disabled}
      cdnBaseUrl={cdnBaseUrl}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      stateIcons={THEME_STRIP_ICONS}
      stripActiveIndex={isDark ? 1 : 0}
      hasFeedback={hasFeedback}
      respectReducedMotion={respectReducedMotion}
    />
  )
}
