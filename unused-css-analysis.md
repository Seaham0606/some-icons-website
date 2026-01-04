# Unused CSS Analysis for site.css

## Summary
The React app (`/react`) uses Tailwind CSS and does NOT use `site.css`. Only the vanilla HTML files use `site.css`:
- `index.html` (main page)
- `generator/index.html` (generator page)
- `changelog/index.html` (changelog page)

## CSS Classes Still Used in Vanilla HTML Files

### Layout & Structure
- `.layout` ✓
- `.content-wrapper` ✓
- `.sidebar` ✓
- `.sidebar-section` ✓
- `.sidebar-utility-bar` ✓
- `.main` ✓

### Sidebar Components
- `.logo` ✓
- `.controls` ✓
- `.customization-panel` ✓
- `.customization-title` ✓
- `.customization-item` ✓
- `.customization-label` ✓

### Search
- `.search-wrapper` ✓
- `.search-icon` ✓

### Segmented Controls
- `.segmented-control` ✓
- `.segment-button` ✓
- `.segment-button.active` ✓
- `.segmented-control.segmented-control-error` ✓ (used in JS)

### Select Dropdown
- `.select-wrapper` ✓
- `.select-icon` ✓

### Color Picker
- `.color-input-wrapper` ✓
- `.color-input-container` ✓
- `.color-input` ✓
- `.color-input.color-input-default` ✓ (used in JS)
- `.color-reset-icon` ✓
- `.color-picker-container` ✓
- `.color-picker` ✓
- `.color-eyedropper-icon` ✓

### Export Panel
- `.export-panel` ✓
- `.export-title` ✓
- `.export-item` ✓
- `.size-control-wrapper` ✓
- `.custom-size-input` ✓
- `.export-button` ✓
- `.export-button.export-button-disabled` ✓ (used in JS)
- `.export-hint` ✗ (NOT FOUND - potentially unused)

### Theme Toggle
- `.theme-toggle-wrapper` ✓
- `.theme-toggle-input` ✓
- `.theme-toggle-switch` ✓
- `.version-label` ✓

### Main Content
- `.icon-grid` ✓

### Icon Cards (dynamically created in JS)
- `.card` ✓
- `.card-selected` ✓ (added via JS)
- `.card-selection-button` ✓ (created in JS)
- `.card-selection-icon` ✓ (created in JS)
- `.iconBox` ✓ (created in JS)
- `.card-name` ✗ (NOT FOUND in HTML/JS - potentially unused)
- `.muted` ✓ (used in JS for loading state)

### Footer
- `.footer` ✓
- `.footer-content` ✓
- `.footer-links` ✓
- `.footer-link-active` ✓
- `.footer-copyright` ✓

### Toast Notifications
- `.toast` ✓
- `.toast.show` ✓ (added via JS)
- `.selected-count-toast` ✓
- `.selected-count-toast.show` ✓ (added via JS)

### Input/Select Base Styles
- Base `input` and `select` styles ✓ (used)
- `.search-wrapper:hover` ✓
- `.search-wrapper:focus-within` ✓

## Potentially Unused CSS Classes

### Definitely Unused (not found in HTML/JS):
1. **`.export-hint`** (lines 518-525) - Not found in any HTML or JS files
2. **`.card-name`** (lines 772-789) - Not found in HTML or JS. The card name display on hover doesn't seem to be implemented.

### Note on `.card-name`:
The CSS for `.card-name` exists and styles a hover effect to show the icon name at the bottom of cards, but this feature doesn't appear to be implemented in the JavaScript. The cards have a `title` attribute for tooltips instead.

## Recommendations

1. **Remove `.export-hint`** - This class is defined but never used in the codebase.

2. **Review `.card-name`** - Either:
   - Remove it if the hover name feature isn't needed
   - Or implement it in JavaScript if it's a desired feature

3. **All other CSS classes are still in use** by the vanilla HTML files, so they should be kept.

