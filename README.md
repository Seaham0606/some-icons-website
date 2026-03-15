# Some Icons Website

Official website for browsing, customizing, and downloading [Some Icons](https://github.com/Seaham0606/some-icons-cdn) - a comprehensive icon library.

## Features

- **Search & Filter** - Quickly find icons by name or category
- **Style Toggle** - Switch between outline and filled icon styles
- **Color Customization** - Apply custom colors to icons or use default colors
- **Batch Export** - Select multiple icons and export them as a ZIP file
- **Size Control** - Choose preset sizes (16, 20, 24, 32) or enter custom dimensions
- **Format Options** - Export as SVG or PNG
  
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

## Monorepo Structure

This repository is a **monorepo** with multiple deployable apps and a shared design system. Icon assets are not stored here; they are loaded from the [Some Icons CDN](https://github.com/Seaham0606/some-icons-cdn) repository.

```
some-icons-website/
├── apps/
│   ├── icons/           # Some Icons browser app (main site)
│   │   ├── src/         # React source, components, pages, stores
│   │   ├── content/     # Changelog markdown files
│   │   ├── scripts/     # Changelog index generator & watch
│   │   ├── server.js    # Local dev server (optional)
│   │   └── dist/        # Production build (generated)
│   ├── ui-docs/         # Design system documentation (placeholder)
│   └── marketing/       # Marketing site (placeholder)
├── packages/
│   └── design-system/   # Shared UI foundations
│       ├── components/  # Reusable components (Label, Switch, Textarea, etc.)
│       └── tokens/      # Design tokens (theme + semantic CSS)
├── LICENSE
└── README.md
```

- **apps/** – Deployable web apps; each can be built and run independently.
- **packages/design-system** – Shared components and design tokens used by apps. Icon assets are out of scope (hosted on a separate CDN repo).

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

1. Clone the repository.
2. From the **repo root**, install dependencies (links workspace packages):
   ```bash
   npm install
   ```
3. Start the icons app in development mode:
   ```bash
   npm run dev
   ```
   Or run only the icons app:
   ```bash
   npm run dev --workspace=apps/icons
   ```
4. The app will be available at the port Vite prints (e.g. `http://localhost:5173`).  
   To use the optional Node server (changelog API, etc.), run from the repo root:
   ```bash
   npm run start --workspace=apps/icons
   ```
   That server runs on port 8000 (or next available).

### Building for Production

From the repo root:

```bash
npm run build
```

Or build only the icons app:

```bash
npm run build --workspace=apps/icons
```

The built files are in `apps/icons/dist/` and can be served by the optional Node server or any static file host.

### Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **JSZip** - For creating ZIP files during export
- **Figtree Font** - Primary typeface

### Changelog Management

The changelog page displays entries from markdown files in `apps/icons/content/changelog/`. Each markdown file should include frontmatter with `title`, `version`, and `date` fields.

**To update the changelog:**

1. **Manual generation** (one-time), from repo root:
   ```bash
   npm run generate-changelog
   ```
   Or from the icons app: `node scripts/generate-changelog-index.js` inside `apps/icons`.

2. **Watch mode** (automatic, recommended for development), from repo root:
   ```bash
   npm run watch-changelog
   ```
   This will watch the `apps/icons/content/changelog/` directory and automatically regenerate the JSON index whenever markdown files are added, modified, or deleted. Press `Ctrl+C` to stop.

The watch script will:
- Generate an initial index on startup
- Automatically regenerate when files in `apps/icons/content/changelog/` change
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
