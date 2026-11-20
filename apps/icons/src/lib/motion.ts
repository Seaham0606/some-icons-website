/**
 * Shared GSAP motion values. Keep in sync with the CSS tokens `--ds-motion-fast|base|slow`
 * (150ms / 250ms / 400ms) in `packages/design-system/src/tokens/theme.css`.
 */
export const MOTION_S = { fast: 0.15, base: 0.25, slow: 0.4 } as const
export const EASE_OUT = 'power3.out'
