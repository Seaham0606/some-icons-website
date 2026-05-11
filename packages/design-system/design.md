# Some UI — design system

Shared visual language and React components for the Some Icons monorepo. Tokens are **CSS custom properties** (exported from Figma). Components ship as **React** with styles in **`components.css`** (no Tailwind utilities inside the design system package).

## Package

- **Name:** `design-system` (workspace package)
- **Entry:** `design-system` → `./src/index.ts`
- **Styles:** `design-system/components.css`, `design-system/tokens` (or `design-system/tokens/index.css`)

Typical app setup:

1. Import tokens once (global): `design-system/tokens` or `design-system/tokens/index.css`
2. Import component styles once: `design-system/components.css`
3. Import React components from `design-system`

Icon glyphs for `SomeIcon` load from the CDN base URL in `package.json` (`someIconsCdnBaseUrl`); override in app code if needed.

## Typography

- **Primary typeface:** Figtree (`--font-family-sans`), with system UI fallbacks.
- **Input value / placeholder:** `--font-size-input` (16px), `--line-height-input` (24px), weight **600** in the Input shell.
- **Input section title:** `--font-size-input-section-label` (15px), `--line-height-input-section-label` (16px), weight **600**.
- **Settings / menu group captions:** `--font-size-settings-group-label` (13px), `--line-height-settings-group-label` (1.1).
- **Utility label classes** in `components.css`: `.label-sm` (14px), `.label-xs` (13px), `.label-3xs` (10px) — weight 500, 110% line height.

## Layout scale

### Spacing

Three parallel scales (same numeric steps, different intent):

| Prefix | Role |
|--------|------|
| `--spacing-padding-*` | Insets inside components and frames |
| `--spacing-gap-*` | Gaps between flex/grid children |
| `--spacing-*` | General spacing |
| `--size-*` | Widths/heights (incl. min sizes) |

Steps include: `0`, `025` (1px), `050` (2px), `1`–`6`, `8`, `10`, `12`, `14`, `16`, `20` (and `24` on `--size-*`). See `src/tokens/theme.css`.

### Icon sizes

`--size-icon-2xs` (12px) through `--size-icon-2xl` (48px).

### Border & radius

- **Border width:** `--border-width-none` … `--border-width-heavy`
- **Radius:** `--radius-none` … `--radius-3xl`, `--radius-full`

### Breakpoints (scale only)

Core widths (apps choose how to use them):

| Token | Value |
|-------|--------|
| `--breakpoint-xs` | 375px |
| `--breakpoint-sm` | 720px |
| `--breakpoint-md` | 1024px |
| `--breakpoint-lg` | 1440px |

Aliases: `--breakpoint-mobile` … `--breakpoint-desktop`. For max-width math: `--breakpoint-below-sm` / `-md` / `-lg` (next step minus 1px).

**Layout token:** `--layout-site-header-content-max` — content track at the large frame (1440px minus two `--spacing-padding-6` gutters).

## Color

### Primitives

Palettes in `src/tokens/theme.css`:

- **Hue ramps:** `red`, `orange`, `yellow`, `green`, `pine`, `teal`, `blue`, `purple`, `pink` — shades `900` → `25`; some families include **alpha** steps (`-alpha-25`, `-50`, `-75`).
- **Gray:** `--color-gray-999` … `--color-gray-10` (dense neutral scale).
- **Absolute:** `--color-black`, `--color-white`.
- **Transparent blacks/whites:** `--color-black-alpha-*`, `--color-white-alpha-*` (opacity ramps).

### Semantic tokens (use these in UI)

Defined in `src/tokens/semantic.css`. They **remap under** `[data-theme="dark"]` on an ancestor (commonly `<html>`).

**Text / foreground**

- `--color-main-primary` … `--color-main-quaternary`, `--color-main-disabled`
- On inverse surfaces: `--color-main-inverse-*`

**Intent**

- Accent, success, warning, error: `--color-intent-*` and `--color-intent-*-strong`

**Surfaces**

- `--color-background-strong`, `--color-background-base`, `--color-background-weak`, `--color-background-elevation`, `--color-background-input`, `--color-background-menu`, `--color-background-inverse`

**Borders**

- Default: `--color-border-extra-strong` … `--color-border-extra-weak`
- Inverse: `--color-border-inverse-*`
- Status: `--color-border-success`, `--color-border-warning`, `--color-border-error`

**Overlays (hover/press scrims, intent washes)**

- `--color-overlay-weak`, `--color-overlay-light-hover`, `--color-overlay-light-pressed`, `--color-overlay-dark-hover`, `--color-overlay-dark-pressed`, `--color-overlay-accent`, etc.

**Buttons**

- Gradient fills: `--button-gradient-primary`, `--button-gradient-secondary`, `--button-gradient-tertiary`, `--button-gradient-inverse` (swap in dark theme)

**Focus**

- Ring color: `--color-focus-accent` (and success/warning/error variants)
- Full ring stack: `--shadow-focus-accent`, `--shadow-focus-success`, `--shadow-focus-warning`, `--shadow-focus-error` (gap uses `--spacing-050` / `--spacing-1` against `--color-background-base`)

**Elevation**

- `--shadow-strong` — layered shadow for popovers / floating panels (light vs dark tuned)

**Product-specific**

- `--color-iconCard-feedback-bg` — “Copied” chip background on icon cards

### Dark mode

Set `data-theme="dark"` on the root (or a subtree). Semantic variables override; **primitive ramps stay the same**. Pair with app-level `prefers-color-scheme` or a toggle as needed.

### Note on validation styling

Input “error” status in components often uses **warning** chroma (borders/focus) for consistency with existing Figma specs; see `components.css` for `.ds-input[data-status="error"]` and segmented control error frames.

## Motion & accessibility

- Dropdowns, collapsible panels, and overlay menus share timing tokens (e.g. `--ds-dropdown-duration` / ease on components).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` shortens or removes transitions on dropdowns, site header panels, buttons, icon cards, and design-system scrollbar timing in `theme.css` / `components.css`.

## Scrollbars

`src/tokens/scrollbar.css` styles global scrollbars. Call **`initDesignSystemScrollbarVisibility()`** (from the package entry) so `<html>` gets `data-scrollbar-active` when the user scrolls or interacts near the gutter — thumbs stay hidden until needed. Behavior is best-effort on Firefox (`scrollbar-width` / `scrollbar-color` only).

## React components

Exported from `src/index.ts`:

| Area | Components |
|------|------------|
| Shell | `SiteHeader`, `SiteFooter`, `Sidebar` |
| Forms | `Input`, `InputField`, `InputSection`, `Dropdown`, `DropdownMenu`, `DropdownOption`, `SegmentedControl`, `Checkbox`, `ColorField`, `ColorSwatch` |
| Actions | `Button`, `BulkActionBar`, `BulkActionBarSettingsPanel` |
| Content | `Chip`, `IconCard`, `IconGrid`, `SomeIcon` |

Utilities: **`cn`**, **`initDesignSystemScrollbarVisibility`**.

Composition patterns:

- **Input** uses leading/trailing **slots**; placeholders for Storybook/docs: `InputSlotPlaceholder`, `DropdownLeadingSlotPlaceholder`, etc.
- **Dropdown** supports inline expansion and **`variant="overlay"`** (portaled menu).
- **Button** variants: `primary`, `secondary`, `tertiary`, `transparent`; sizes `sm` / `md` / `lg`; radius scale via `ButtonRadius`.

## Conventions

1. **Prefer semantic tokens** (`--color-main-*`, `--color-background-*`, `--color-border-*`) over raw palette steps in product UI.
2. **Spacing** — use `--spacing-padding-*` for padding, `--spacing-gap-*` for gaps, `--size-*` for fixed dimensions where the scale matches.
3. **Figma** — many class blocks cite Figma node IDs in `components.css` for traceability.
4. **Tailwind** — allowed in apps; the design-system package itself uses plain CSS classes with the `ds-` prefix.

## Documentation & source of truth

- **Tokens:** `src/tokens/theme.css`, `src/tokens/semantic.css`, `src/tokens/scrollbar.css`
- **Component markup & states:** `src/components/**/*.tsx` + `src/components.css`
- **Interactive docs:** `apps/ui-docs` (Storybook)

When README examples use names like `--color-background-primary` or `--color-text-primary`, they may predate the current token set; this file and `semantic.css` are authoritative.
