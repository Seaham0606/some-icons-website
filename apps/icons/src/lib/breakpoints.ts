/**
 * Layout breakpoints for `matchMedia` / TS logic.
 *
 * **Canonical layout px** for the shared scale live in `packages/design-system/src/tokens/theme.css` as
 * `--breakpoint-xs` … `--breakpoint-lg` (and semantic aliases). Keep `BREAKPOINTS` / `BREAKPOINT_MAX` identical
 * to those tokens (most browsers cannot use `var()` in `@media`, so CSS duplicates literals).
 *
 * **This app (icon library) today:** chrome switches to the “laptop” pattern from `laptopMin` up; there is
 * no separate layout fork at `desktopMin` yet — `desktopMin` / `desktopAndUp` are for optional queries
 * (e.g. max content width) or future use. Other pages or products can branch differently; overrides belong
 * in app or page CSS / hooks, not in the design-system tokens.
 *
 * Figma reference (current selection):
 * - **Tablet:** Top “Sidebar” is a full-width bar: logo + title + version chip, **search** field, **settings**
 *   icon. Everything that lived in the left sidebar (style, categories, export/settings) moves behind
 *   settings; search stays visible. **Footer** is its own strip at the **bottom of the viewport** (not
 *   inside the scrolling grid). Icon grid uses **6** columns at the ~834px tablet frame.
 * - **Mobile:** Compact header: logo + title + chip + **two** icon buttons (e.g. search + settings).
 *   **Footer** follows **after the icon grid** in document order (scrolls with content). Icon grid: **4**
 *   columns at the ~402px frame.
 */

export const BREAKPOINTS = {
  mobileMin: 375,
  tabletMin: 720,
  laptopMin: 1024,
  desktopMin: 1440,
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

/** Pixel upper bounds for inclusive design ranges (use with min-width media queries). */
export const BREAKPOINT_MAX = {
  /** Viewports below `tabletMin` — mobile layout. */
  mobile: BREAKPOINTS.tabletMin - 1,
  /** Tablet band upper edge. */
  tablet: BREAKPOINTS.laptopMin - 1,
  /** Upper edge of the viewport band below `desktopMin` (1440px). */
  laptop: BREAKPOINTS.desktopMin - 1,
} as const

/**
 * Home page icon grid column steps inside the tablet band only (`tabletMin`–`BREAKPOINT_MAX.tablet`).
 * Icons-app only — mirrored in `src/index.css` as `--icons-home-icon-grid-*` (not design-system).
 */
export const TABLET_ICON_GRID = {
  sevenColumnMinPx: 880,
  eightColumnMinPx: 960,
} as const

/** Media-query strings for `window.matchMedia` / React hooks. Keep in sync with `theme.css` breakpoints and `index.css` layout `@media` literals. */
export const MEDIA_QUERIES = {
  /** Mobile layout: viewport width at or below mobile band. */
  mobileLayout: `(max-width: ${BREAKPOINT_MAX.mobile}px)`,
  /** Tablet-only (narrow main). */
  tabletOnly: `(min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINT_MAX.tablet}px)`,
  /** This app: sidebar / laptop chrome from `laptopMin` up (see file comment). */
  laptopAndUp: `(min-width: ${BREAKPOINTS.laptopMin}px)`,
  /** From `desktopMin` up — optional today; use when a page needs a desktop-only rule. */
  desktopAndUp: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
  /** Everything narrower than laptop (mobile + tablet). */
  belowLaptop: `(max-width: ${BREAKPOINT_MAX.tablet}px)`,
} as const
