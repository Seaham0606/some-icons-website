# UI Component Audit

This document provides a comprehensive inventory of all UI components currently used in the Some Icons website codebase. This audit was conducted to support a future major restyling update.

**Audit Date:** 2026
**Scope:** All React components and UI primitives used across the application

---

## Table of Contents

1. [UI Primitives](#ui-primitives)
2. [Layout Components](#layout-components)
3. [Control Components](#control-components)
4. [Icon Components](#icon-components)
5. [Changelog Components](#changelog-components)
6. [Generator Components](#generator-components)
7. [Native HTML Elements Used Directly](#native-html-elements-used-directly)

---

## UI Primitives

Components located in `/react/src/components/ui/` that serve as reusable building blocks.

### Textarea

- **File Path:** `react/src/components/ui/textarea.tsx`
- **Base HTML Element:** `<textarea>`
- **Where Used:**
  - `GeneratorForm` (summary, added, changed, fixed, removed, deprecated, notes fields)
- **Behavior:** Input-like control
- **Notes:** Multi-line text input component.

### CdnIcon

### Toaster (Sonner)

- **File Path:** `react/src/components/ui/sonner.tsx`
- **Base HTML Element:** Sonner toast library component (renders as portal with custom DOM structure)
- **Where Used:**
  - `App.tsx` (global toast notifications)
- **Behavior:** Interactive control (dismissible notifications)
- **Notes:** Wraps Sonner toast library. Customized with CdnIcon for success icon and custom styling. Used for success/error notifications throughout the app.

---

## Layout Components

Components located in `/react/src/components/layout/` that structure the page layout.

### Sidebar

- **File Path:** `react/src/components/layout/Sidebar.tsx`
- **Base HTML Element:** `<aside>`
- **Where Used:**
  - `HomePage` (main sidebar with filters and controls)
  - `ChangelogPage` (sidebar with version list)
- **Behavior:** Display-only element (container)
- **Notes:** Responsive sidebar that slides in on mobile. Includes backdrop overlay on mobile. Manages body scroll lock when open on mobile.

### SidebarHeader

- **File Path:** `react/src/components/layout/Sidebar.tsx`
- **Base HTML Element:** `<div>`
- **Where Used:**
  - `HomePage` (logo section)
  - `ChangelogPage` (back link and title)
- **Behavior:** Display-only element (container)
- **Notes:** Header section of the sidebar.

### SidebarContent

- **File Path:** `react/src/components/layout/Sidebar.tsx`
- **Base HTML Element:** `<div>`
- **Where Used:**
  - `HomePage` (search, filters, customize, export sections)
  - `ChangelogPage` (version list)
- **Behavior:** Display-only element (container)
- **Notes:** Scrollable content area of the sidebar.

### SidebarFooter

- **File Path:** `react/src/components/layout/Sidebar.tsx`
- **Base HTML Element:** `<div>`
- **Where Used:**
  - `HomePage` (theme toggle and version)
  - `ChangelogPage` (theme toggle)
- **Behavior:** Display-only element (container)
- **Notes:** Footer section of the sidebar.

### MainContent

- **File Path:** `react/src/components/layout/MainContent.tsx`
- **Base HTML Element:** `<main>`
- **Where Used:**
  - `HomePage` (main content area with icon grid)
  - `ChangelogPage` (main content area with changelog entries)
- **Behavior:** Display-only element (container)
- **Notes:** Main content container with flex layout.

### ScrollArea

- **File Path:** `react/src/components/layout/MainContent.tsx`
- **Base HTML Element:** `<div>`
- **Where Used:**
  - `HomePage` (scrollable area containing IconGrid)
  - `ChangelogPage` (scrollable area containing changelog entries)
- **Behavior:** Display-only element (container)
- **Notes:** Scrollable container wrapper.

### Footer

- **File Path:** `react/src/components/layout/Footer.tsx`
- **Base HTML Element:** `<footer>`
- **Where Used:**
  - `HomePage` (page footer)
  - `ChangelogPage` (page footer)
- **Behavior:** Display-only element (with interactive links)
- **Notes:** Contains copyright, links to Figma plugin, Changelog, GitHub, and MIT License. Uses `<a>` and React Router `<Link>` elements.

### MobileHeader

- **File Path:** `react/src/components/layout/MobileHeader.tsx`
- **Base HTML Element:** `<header>`
- **Where Used:**
  - `HomePage` (mobile header with hamburger menu)
- **Behavior:** Interactive control (contains toggle button)
- **Notes:** Mobile-only header with logo/title and sidebar toggle button. Uses CdnIcon for hamburger menu icon.

### ThemeToggle

- **File Path:** `react/src/components/layout/ThemeToggle.tsx`
- **Base HTML Element:** `<div>` wrapper around `Switch` component
- **Where Used:**
  - `HomePage` (in SidebarFooter)
  - `ChangelogPage` (in SidebarFooter)
  - `GeneratorPage` (in header)
- **Behavior:** Interactive control
- **Notes:** Wraps Switch component to toggle between light and dark themes.

---

## Control Components

Components located in `/react/src/components/controls/` that provide user interaction controls.

### SearchInput

- **File Path:** `react/src/components/controls/SearchInput.tsx`
- **Base HTML Element:** `<div>` wrapper around `Input` component
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Input-like control
- **Notes:** Text input with search icon. Uses Input component with left padding for icon. Filters icons by search query.

### StyleToggle

- **File Path:** `react/src/components/controls/StyleToggle.tsx`
- **Base HTML Element:** `SegmentedControl` component
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Interactive control
- **Notes:** Uses SegmentedControl to toggle between 'outline' and 'filled' icon styles.

### CategorySelect

- **File Path:** `react/src/components/controls/CategorySelect.tsx`
- **Base HTML Element:** `<select>` with custom styling
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Input-like control
- **Notes:** Native HTML select element styled with inputBaseStyles. Includes dropdown arrow icon (CdnIcon). Filters icons by category.

### ColorPicker

- **File Path:** `react/src/components/controls/ColorPicker.tsx`
- **Base HTML Element:** `<div>` wrapper containing `Input` and native `<input type="color">`
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Input-like control
- **Notes:** Combines text input for hex color value with native color picker input. Includes reset button with undo icon. Applies color to icons.

### SizeSelector

- **File Path:** `react/src/components/controls/SizeSelector.tsx`
- **Base HTML Element:** `<div>` wrapper containing `SegmentedControl` and native `<input type="number">`
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Input-like control
- **Notes:** Combines SegmentedControl for preset sizes with number input for custom size. Supports validation with error state.

### FormatSelector

- **File Path:** `react/src/components/controls/FormatSelector.tsx`
- **Base HTML Element:** `SegmentedControl` component
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Interactive control
- **Notes:** Uses SegmentedControl to select between 'SVG' and 'PNG' export formats. Supports validation with error state.

### ExportButton

- **File Path:** `react/src/components/controls/ExportButton.tsx`
- **Base HTML Element:** `<button>`
- **Where Used:**
  - `HomePage` (in SidebarContent)
- **Behavior:** Interactive control
- **Notes:** Custom styled button (not using Button component). Shows selected icon count. Displays loading state during export. Shows tooltip when no icons selected. Triggers ZIP file download.

---

## Icon Components

Components located in `/react/src/components/icons/` that display and manage icons.

### IconCard

- **File Path:** `react/src/components/icons/IconCard.tsx`
- **Base HTML Element:** `<button>` (main card) and nested `<button>` (selection indicator)
- **Where Used:**
  - `IconGrid` (renders multiple IconCard instances)
- **Behavior:** Interactive control
- **Notes:** Clickable card displaying an icon preview. Supports single-click copy mode and multi-select mode. Contains selection radio button indicator. Shows tooltip on copy. Uses IconPreview for rendering.

### IconGrid

- **File Path:** `react/src/components/icons/IconGrid.tsx`
- **Base HTML Element:** `<div>` with CSS Grid layout
- **Where Used:**
  - `HomePage` (in ScrollArea)
- **Behavior:** Display-only element (container)
- **Notes:** Responsive grid layout for icon cards. Handles loading, error, and empty states. Calculates bottom padding based on footer height. Filters and sorts icons based on search, category, and style.

### IconPreview

- **File Path:** `react/src/components/icons/IconPreview.tsx`
- **Base HTML Element:** `<div>` with CSS mask
- **Where Used:**
  - `IconCard` (displays the icon)
- **Behavior:** Display-only element
- **Notes:** Fetches SVG and renders using CSS mask technique. Applies selected color as background. Shows loading and error states.

---

## Changelog Components

Components located in `/react/src/components/changelog/` for displaying changelog content.

### ChangelogEntry

- **File Path:** `react/src/components/changelog/ChangelogEntry.tsx`
- **Base HTML Element:** `<article>`
- **Where Used:**
  - `ChangelogPage` (renders multiple ChangelogEntry instances)
- **Behavior:** Display-only element
- **Notes:** Displays a single changelog entry with version, date, title, and HTML content. Uses dangerouslySetInnerHTML for markdown-rendered content.

### VersionList

- **File Path:** `react/src/components/changelog/VersionList.tsx`
- **Base HTML Element:** `<nav>` containing `<a>` elements
- **Where Used:**
  - `ChangelogPage` (in SidebarContent)
- **Behavior:** Interactive control (navigation links)
- **Notes:** Navigation list of version links. Highlights active version based on hash. Uses anchor links for navigation.

---

## Generator Components

Components located in `/react/src/components/generator/` for the changelog generator page.

### GeneratorForm

- **File Path:** `react/src/components/generator/GeneratorForm.tsx`
- **Base HTML Element:** `<div>` container with form elements
- **Where Used:**
  - `GeneratorPage` (main form)
- **Behavior:** Interactive control (form)
- **Notes:** Complex form with multiple Input, Textarea, SegmentedControl, Button, and Label components. Generates markdown changelog entries. Uses toast notifications for feedback.

---

## Native HTML Elements Used Directly

Native HTML elements used directly in pages/components without wrapper components.

### `<img>`

- **Where Used:**
  - `HomePage` (logo in SidebarHeader)
  - `ChangelogPage` (favicon in mobile header and SidebarHeader)
  - `GeneratorPage` (not directly, but referenced in code)
- **Behavior:** Display-only element
- **Notes:** Used for logo and favicon images.

### `<a>` (Anchor Links)

- **Where Used:**
  - `Footer` (external links: Figma plugin, GitHub, MIT License)
  - `VersionList` (version navigation links)
  - `ChangelogPage` (back link in SidebarHeader)
  - `GeneratorPage` (back link in header)
- **Behavior:** Interactive control
- **Notes:** Used for external links and internal navigation (some use React Router Link component).

### `<button>` (Native)

- **Where Used:**
  - `HomePage` (Select all, Deselect buttons - inline styled)
  - `ChangelogPage` (mobile header toggle button - inline styled)
  - `ColorPicker` (reset button - inline styled)
  - `IconCard` (selection indicator button - inline styled)
  - `ExportButton` (main export button - custom styled, not using Button component)
- **Behavior:** Interactive control
- **Notes:** Several native buttons with custom styling instead of using the Button component.

### `<select>` (Native)

- **Where Used:**
  - `CategorySelect` (styled with inputBaseStyles)
- **Behavior:** Input-like control
- **Notes:** Native select element with custom styling.

### `<input type="color">` (Native)

- **Where Used:**
  - `ColorPicker` (hidden color picker input)
- **Behavior:** Input-like control
- **Notes:** Native color picker input, visually hidden with custom styled container overlay.

### `<input type="number">` (Native)

- **Where Used:**
  - `SizeSelector` (custom size input)
- **Behavior:** Input-like control
- **Notes:** Native number input styled with inputBaseStyles.

### `<div>` (Generic Containers)

- **Where Used:**
  - Throughout all components for layout and structure
- **Behavior:** Display-only element
- **Notes:** Used extensively for layout, grouping, and styling purposes.

### `<span>` (Inline Text)

- **Where Used:**
  - `HomePage` (version display in SidebarFooter)
  - `Footer` (copyright text)
  - Various components for inline text styling
- **Behavior:** Display-only element
- **Notes:** Used for inline text and styling.

### `<header>`

- **Where Used:**
  - `GeneratorPage` (page header)
  - `MobileHeader` (mobile header component)
  - `ChangelogPage` (ChangelogMobileHeader - inline component)
- **Behavior:** Display-only element (semantic container)
- **Notes:** Semantic HTML for page headers.

### `<footer>`

- **Where Used:**
  - `Footer` component
- **Behavior:** Display-only element (semantic container)
- **Notes:** Semantic HTML for page footer.

### `<nav>`

- **Where Used:**
  - `VersionList` (version navigation)
- **Behavior:** Display-only element (semantic container)
- **Notes:** Semantic HTML for navigation.

### `<main>`

- **Where Used:**
  - `MainContent` component
  - `GeneratorPage` (main content area)
- **Behavior:** Display-only element (semantic container)
- **Notes:** Semantic HTML for main content.

### `<aside>`

- **Where Used:**
  - `Sidebar` component
- **Behavior:** Display-only element (semantic container)
- **Notes:** Semantic HTML for sidebar.

### `<article>`

- **Where Used:**
  - `ChangelogEntry` component
- **Behavior:** Display-only element (semantic container)
- **Notes:** Semantic HTML for article content.

### `<time>`

- **Where Used:**
  - `ChangelogEntry` (date display)
- **Behavior:** Display-only element
- **Notes:** Semantic HTML for date/time.

### `<h1>`, `<h2>`, `<h3>`

- **Where Used:**
  - Various components for headings
- **Behavior:** Display-only element
- **Notes:** Semantic HTML headings used throughout.

### `<p>`

- **Where Used:**
  - `GeneratorPage` (description text)
- **Behavior:** Display-only element
- **Notes:** Semantic HTML for paragraphs.

### `<label>` (Native)

- **Where Used:**
  - `HomePage` (inline labels for Style, Category, Color, Icon size, File format sections)
- **Behavior:** Display-only element
- **Notes:** Native label elements with custom styling (not using Label component).

---

## Summary Statistics

- **Total Custom React Components:** 28
- **UI Primitive Components:** 8
- **Layout Components:** 8
- **Control Components:** 7
- **Icon Components:** 3
- **Changelog Components:** 2
- **Generator Components:** 1
- **Pages:** 3 (HomePage, ChangelogPage, GeneratorPage)

---

## Notes on Component Architecture

1. **Component Organization:** Components are well-organized into logical folders (ui, layout, controls, icons, changelog, generator).

2. **UI Primitives:** The `ui/` folder contains reusable primitives that wrap Radix UI components or provide base styling.

3. **Styling Approach:** Components use Tailwind CSS with CSS custom properties for theming. Some components export shared style arrays (e.g., `inputBaseStyles`).

4. **Native Element Usage:** Several native HTML elements are used directly with custom styling instead of wrapper components (e.g., native buttons in HomePage, native select in CategorySelect).

5. **Third-Party Libraries:**
   - Radix UI: Used for Switch, Label primitives
   - Sonner: Used for toast notifications
   - React Router: Used for navigation (Link component)

6. **Component Composition:** Some components compose other components (e.g., StyleToggle uses SegmentedControl, SearchInput uses Input).

7. **State Management:** Components use Zustand stores for state management (filterStore, selectionStore, colorStore, exportStore, uiStore).

---

## Component Usage Matrix

| Component | HomePage | ChangelogPage | GeneratorPage |
|-----------|----------|---------------|---------------|
| Sidebar | ✓ | ✓ | - |
| MainContent | ✓ | ✓ | - |
| ScrollArea | ✓ | ✓ | - |
| Footer | ✓ | ✓ | - |
| MobileHeader | ✓ | - | - |
| ThemeToggle | ✓ | ✓ | ✓ |
| SearchInput | ✓ | - | - |
| StyleToggle | ✓ | - | - |
| CategorySelect | ✓ | - | - |
| ColorPicker | ✓ | - | - |
| SizeSelector | ✓ | - | - |
| FormatSelector | ✓ | - | - |
| ExportButton | ✓ | - | - |
| IconGrid | ✓ | - | - |
| IconCard | ✓ (via IconGrid) | - | - |
| IconPreview | ✓ (via IconCard) | - | - |
| VersionList | - | ✓ | - |
| ChangelogEntry | - | ✓ | - |
| GeneratorForm | - | - | ✓ |
| Button | - | - | ✓ |
| Input | ✓ (via controls) | - | ✓ |
| Textarea | - | - | ✓ |
| Label | - | - | ✓ |
| SegmentedControl | ✓ (via controls) | - | ✓ |
| CdnIcon | ✓ (via multiple) | ✓ | ✓ |
| Toaster | ✓ (global) | ✓ (global) | ✓ (global) |

---

*End of Audit*

