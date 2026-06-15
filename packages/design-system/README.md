# @someicons/design-system

Shared visual language and React components for the **Some Icons** ecosystem.

- **Design tokens** as CSS custom properties (colors, spacing, radii, typography, shadows) with built-in light/dark theming.
- **React components** (buttons, inputs, dropdowns, sidebars, icon cards, and more) styled with plain CSS — no Tailwind required in your app.
- **ESM** package with full TypeScript types.

## Installation

```bash
npm install @someicons/design-system
```

`react` and `react-dom` are peer dependencies (React 18 or 19):

```bash
npm install react react-dom
```

## Usage

### 1. Import the styles once (e.g. in your app entry or root CSS)

```ts
// Tokens (CSS custom properties) — required
import "@someicons/design-system/tokens"
// Component styles — required for components to look correct
import "@someicons/design-system/components.css"
```

Or from a CSS file:

```css
@import "@someicons/design-system/tokens";
@import "@someicons/design-system/components.css";
```

### 2. Use the components

```tsx
import { Button, SomeIcon } from "@someicons/design-system"

export function Example() {
  return (
    <Button variant="primary" size="md">
      <SomeIcon id="heart" />
      Like
    </Button>
  )
}
```

### 3. Enable smart scrollbars (optional)

```ts
import { initDesignSystemScrollbarVisibility } from "@someicons/design-system"

initDesignSystemScrollbarVisibility()
```

## Dark mode

Set `data-theme="dark"` on the document root (or any subtree). Semantic tokens
remap automatically; primitive palette ramps stay the same.

```html
<html data-theme="dark">
```

## Exports

| Entry | Description |
| --- | --- |
| `@someicons/design-system` | React components + utilities (`cn`, `initDesignSystemScrollbarVisibility`) |
| `@someicons/design-system/tokens` | All tokens (theme + semantic + scrollbar) |
| `@someicons/design-system/tokens/theme.css` | Primitive tokens only |
| `@someicons/design-system/tokens/semantic.css` | Semantic tokens only |
| `@someicons/design-system/tokens/scrollbar.css` | Scrollbar styling only |
| `@someicons/design-system/components.css` | Component styles |

## Icons (`SomeIcon`)

`SomeIcon` loads glyphs from the Some Icons CDN at runtime. The default base URL
is read from this package's `someIconsCdnBaseUrl` field. See the
[Some Icons CDN](https://github.com/Seaham0606/some-icons-cdn).

## Documentation

See [`design.md`](./design.md) for the full token and component reference.

## License

[MIT](./LICENSE) © Seaham0606
