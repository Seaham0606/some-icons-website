import { cn } from '@/lib/utils'
import BlurEffect from 'react-progressive-blur'
import type { CSSProperties, ReactNode } from 'react'

/** Standard `linear-gradient` keywords; any other string is forwarded (e.g. `90deg`). */
export type GradientOverlayLinearDirection =
  | 'to top'
  | 'to bottom'
  | 'to left'
  | 'to right'
  | (string & {})

export type ProgressiveBlurPosition = 'top' | 'bottom' | 'left' | 'right'

export interface GradientOverlayProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  /** When false, the overlay is faded out (opacity 0). Default true. */
  visible?: boolean

  fullWidth?: boolean
  fullHeight?: boolean

  gradientFill?: boolean
  /** CSS color at the gradient start. Default `transparent`. */
  gradientFrom?: string
  /** CSS color at the gradient end. Default `var(--color-background-base)`. */
  gradientTo?: string
  gradientDirection?: GradientOverlayLinearDirection

  progressiveBlur?: boolean
  progressiveBlurIntensity?: number
  progressiveBlurPosition?: ProgressiveBlurPosition
  progressiveBlurClassName?: string

  /** Uniform `backdrop-filter: blur()` over the overlay bounds. */
  backdropBlur?: boolean
  backdropBlurAmount?: string
}

const defaultVisible = true

/** Default height for the home page bottom multi-select strip (px). */
export const GRADIENT_OVERLAY_HOME_HEIGHT_PX = 200

export function GradientOverlay({
  children,
  className,
  style,
  visible = defaultVisible,
  fullWidth = false,
  fullHeight = false,
  gradientFill = false,
  gradientFrom = 'transparent',
  gradientTo = 'var(--color-background-base)',
  gradientDirection = 'to bottom',
  progressiveBlur = false,
  progressiveBlurIntensity = 40,
  progressiveBlurPosition = 'bottom',
  progressiveBlurClassName,
  backdropBlur = false,
  backdropBlurAmount = '12px',
}: GradientOverlayProps) {
  const gradientStyle: CSSProperties | undefined = gradientFill
    ? {
        background: `linear-gradient(${gradientDirection}, ${gradientFrom}, ${gradientTo})`,
      }
    : undefined

  const backdropStyle: CSSProperties | undefined = backdropBlur
    ? {
        backdropFilter: `blur(${backdropBlurAmount})`,
        WebkitBackdropFilter: `blur(${backdropBlurAmount})`,
      }
    : undefined

  return (
    <div
      className={cn(
        'gradient-overlay',
        visible && 'gradient-overlay--visible',
        fullWidth && 'gradient-overlay--fullWidth',
        fullHeight && 'gradient-overlay--fullHeight',
        className,
      )}
      style={style}
      aria-hidden={!visible}
    >
      <div className="gradient-overlay__layers" aria-hidden>
        {progressiveBlur ? (
          <div className="gradient-overlay__progressiveMount">
            <BlurEffect
              position={progressiveBlurPosition}
              intensity={progressiveBlurIntensity}
              className={cn('gradient-overlay__progressiveBlur', progressiveBlurClassName)}
            />
          </div>
        ) : null}
        {backdropBlur ? (
          <div className="gradient-overlay__backdropBlur" style={backdropStyle} />
        ) : null}
        {gradientFill ? (
          <div className="gradient-overlay__gradient" style={gradientStyle} />
        ) : null}
      </div>
      {children ? (
        <div className="gradient-overlay__content">{children}</div>
      ) : null}
    </div>
  )
}
