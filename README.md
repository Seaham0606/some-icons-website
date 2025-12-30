# Some Icons Website

Official website for browsing, customizing, and downloading [Some Icons](https://github.com/Seaham0606/some-icons-cdn) - a comprehensive icon library.

## Features

- 🔍 **Search & Filter** - Quickly find icons by name or category
- 🎨 **Style Toggle** - Switch between outline and filled icon styles
- 🌈 **Color Customization** - Apply custom colors to icons or use default colors
- 📦 **Batch Export** - Select multiple icons and export them as a ZIP file
- 📐 **Size Control** - Choose preset sizes (16, 20, 24, 32) or enter custom dimensions
- 💾 **Format Options** - Export as SVG or PNG
- 
## Usage

### Browsing Icons

1. Use the search bar to find icons by name
2. Filter by category using the dropdown menu
3. Toggle between **Outline** and **Filled** styles using the segmented control

### Customizing Icons

1. **Color**: Enter a hex color code (e.g., `#FF5733`) or click the color picker
   - Use "Default" to return to the original icon colors
   - Click the reset button (↻) to clear custom colors

### Exporting Icons

1. **Single Icon**: Click any icon card to copy its SVG code to clipboard
2. **Multiple Icons**:
   - Click the selection button (radio icon) on each icon you want to export
   - Choose icon size (preset or custom)
   - Select file format (SVG or PNG)
   - Click **Export** to download a ZIP file containing all selected icons

### Keyboard Shortcuts

- Click any icon to copy SVG to clipboard (when no icons are selected)
- Press Enter in color input to apply the color

## Project Structure

```
some-icons-website/
├── index.html          # Main HTML structure
├── script.js           # Application logic and icon handling
├── assets/
│   ├── css/
│   │   ├── colors.css  # Color tokens and theme definitions
│   │   └── site.css    # Component styles and layout
│   └── images/
│       ├── favicon.png
│       └── logo-some-icons-full.svg
├── LICENSE             # MIT License
└── README.md           # This file
```

## Color System

This project uses a comprehensive color token system exported from Figma. All colors are available as CSS custom properties.

### Color Families

Available color families: `red`, `orange`, `yellow`, `green`, `pine`, `teal`, `blue`, `purple`, `pink`, `gray`

Each family includes shades from `900` (darkest) to `25` (lightest):
- `900`, `800`, `700`, `600`, `500`, `400`, `300`, `200`, `100`, `50`, `25`

### Semantic Tokens

Semantic tokens automatically adapt to light/dark mode:

**Background:**
- `--color-background-primary` - Main background
- `--color-background-weak` - Subtle background
- `--color-background-hover` - Hover state

**Text:**
- `--color-text-primary` - Primary text
- `--color-text-secondary` - Secondary text
- `--color-text-tertiary` - Tertiary text

**Interactive:**
- `--color-primary` - Primary action color (blue)
- `--color-focus` - Focus state color

### Dark Mode

Dark mode is supported via:
- `data-theme="dark"` attribute on the document element
- System preference detection (`prefers-color-scheme: dark`)
- Manual theme toggle in the sidebar

### Usage Example

```css
.my-element {
  color: var(--color-text-primary);
  background: var(--color-background-primary);
  border: 1px solid var(--color-border-subtle);
}

.my-button {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.my-button:hover {
  background: var(--color-primary-hover);
}
```

## Development

### Local Setup

1. Clone the repository
2. Serve the files using a local web server (required for fetching icons from CDN)
3. Open `index.html` in your browser

### Dependencies

- [JSZip](https://stuk.github.io/jszip/) - For creating ZIP files during export
- [Figtree Font](https://fonts.google.com/specimen/Figtree) - Primary typeface

### Changelog Management

The changelog page displays entries from markdown files in `content/changelog/`. Each markdown file should include frontmatter with `title`, `version`, and `date` fields.

**To update the changelog:**

1. **Manual generation** (one-time):
   ```bash
   node scripts/generate-changelog-index.js
   ```

2. **Watch mode** (automatic, recommended for development):
   ```bash
   node scripts/watch-changelog.js
   ```
   This will watch the `content/changelog/` directory and automatically regenerate the JSON index whenever markdown files are added, modified, or deleted. Press `Ctrl+C` to stop.

The watch script will:
- Generate an initial index on startup
- Automatically regenerate when files change
- Debounce changes (waits 300ms after last change) to avoid excessive regeneration
- Handle file additions, modifications, and deletions

### Icon Data Source

Icons are loaded from the [Some Icons CDN](https://github.com/Seaham0606/some-icons-cdn) repository:
- Base URL: `https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/`
- Index file: `index.json` (contains icon metadata)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- [Some Icons CDN Repository](https://github.com/Seaham0606/some-icons-cdn)
- [GitHub Repository](https://github.com/Seaham0606/some-icons-website)

---

Made with ❤️ for the design community
