# some-icons-website
Official website for Some Icons

## Color Tokens

This project uses color tokens exported from Figma. The tokens are available as CSS custom properties in `assets/css/colors.css`.

### Usage in CSS

```css
.my-element {
  color: var(--color-blue-500);
  background: var(--color-red-100);
  border-color: var(--color-border);
}
```

### Available Color Families

- `red`, `orange`, `yellow`, `green`, `pine`, `teal`, `blue`, `purple`, `pink`, `gray`

### Available Shades

Each color family has shades from `900` (darkest) to `25` (lightest):
- `900`, `800`, `700`, `600`, `500`, `400`, `300`, `200`, `100`, `50`, `25`

### Grayscale Tokens

Special grayscale tokens are available:
- `white`, `1`, `25`, `50`, `75`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `850`, `900`, `925`, `950`, `975`, `999`, `black`

Usage: `var(--color-white)`, `var(--color-gray-500)`, `var(--color-black)`

### Semantic Tokens

For common use cases, semantic tokens are available. These automatically adapt to light/dark mode:

**Background:**
- `--color-background-primary` - Main background (white in light, black in dark)
- `--color-background` - General background
- `--color-background-hover` - Hover state background
- `--color-background-active` - Active state background

**Text:**
- `--color-text-primary` - Primary text (black in light, white in dark)
- `--color-text-secondary` - Secondary text
- `--color-text-tertiary` - Tertiary text
- `--color-text-inverse` - Inverse text color

**Items:**
- `--color-item-primary` - Primary item color (black in light, white in dark)

**Borders:**
- `--color-border` - Standard border
- `--color-border-subtle` - Subtle border

**Interactive:**
- `--color-primary` - Primary action color
- `--color-primary-hover` - Primary hover state
- `--color-focus` - Focus state color

**Dark Mode Support:**
Semantic tokens automatically switch based on:
- `data-theme="dark"` attribute on any parent element
- `prefers-color-scheme: dark` media query (system preference)

### Usage in JavaScript

Import the colors utility:

```javascript
// Access via CSS variables
const blue500 = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-blue-500');

// Or use the Colors utility (if loaded)
const hex = Colors.getHex('blue', '500');
const rgb = Colors.getRGB('blue', '500');
```
