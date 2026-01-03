# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

React 19, TypeScript, Vite 7, Tailwind CSS v4, TanStack Query, Zustand, React Router v7, Radix UI primitives, JSZip

## Project Overview

This is a React rewrite of an icon browsing website called "Some Icons". The app fetches icons from a CDN, displays them in a searchable/filterable grid, and allows users to customize and export icons in SVG or PNG format.

## Common Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # TypeScript check + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture

### State Management
Uses Zustand stores in `src/stores/`:
- `filterStore` - Search query, category, and style (outline/filled) filters
- `selectionStore` - Tracks selected icons for batch export
- `colorStore` - User-selected icon color customization
- `exportStore` - Export settings (size, format)
- `uiStore` - UI state like sidebar visibility

### Data Flow
1. Icons fetched from CDN via TanStack Query (`useIcons` hook)
2. Icon index JSON contains metadata (id, category, tags, file paths)
3. Individual SVGs fetched on-demand for preview and export
4. SVG manipulation utilities in `src/lib/svg-utils.ts` handle color application and sizing

### Key Directories
- `src/pages/` - Route components (HomePage, ChangelogPage, GeneratorPage)
- `src/components/controls/` - Sidebar filter/export controls
- `src/components/icons/` - IconGrid and IconCard components
- `src/components/ui/` - Radix-based shadcn/ui primitives
- `src/hooks/` - TanStack Query hooks for data fetching
- `src/lib/` - Utilities (API, SVG manipulation, export logic)
- `src/types/` - TypeScript interfaces

### Routing
React Router v7 with three routes: `/` (icon browser), `/changelog`, `/generator`

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- CSS variables for theming (`--foreground`, `--background`, etc.)
- Path alias `@/` maps to `src/`

### Export Flow
Selected icons are processed through `src/lib/export-utils.ts`:
1. SVGs have viewBox ensured, color applied, dimensions set
2. For PNG: SVG rendered to canvas then converted to blob
3. Multiple icons bundled into ZIP using JSZip
