# site.css Detailed Breakdown

## Current Status

After React migration, `site.css` is **only used by the vanilla `index.html`** (which is now a fallback).

## CSS Sections in site.css

### ✅ Still Used (by vanilla index.html)

1. **Root Variables** (lines 1-5)
   - Basic font and color setup
   - Used by vanilla HTML

2. **Layout** (lines 22-37)
   - `.layout`, `.content-wrapper`
   - Used by vanilla `index.html`

3. **Sidebar** (lines 39-84)
   - `.sidebar`, `.sidebar-section`, `.sidebar-utility-bar`, `.version-label`
   - Used by vanilla `index.html`

4. **Theme Toggle** (lines 86-151)
   - `.theme-toggle-wrapper`, `.theme-toggle-input`, `.theme-toggle-switch`
   - Used by vanilla `index.html`

5. **Footer** (lines 153-215)
   - `.footer`, `.footer-content`, `.footer-links`, `.footer-link-active`
   - Used by vanilla `index.html`

6. **Customization Panel** (lines 217-243)
   - `.customization-panel`, `.customization-title`, `.customization-item`, `.customization-label`
   - Used by vanilla `index.html`

7. **Color Picker** (lines 244-334)
   - `.color-input-wrapper`, `.color-input-container`, `.color-input`, `.color-reset-icon`, `.color-picker-container`, `.color-picker`, `.color-eyedropper-icon`
   - Used by vanilla `index.html`

8. **Export Panel** (lines 336-355)
   - `.export-panel`, `.export-title`, `.export-item`
   - Used by vanilla `index.html`

9. **Segmented Control** (lines 357-452)
   - `.segmented-control`, `.segment-button`, `.size-control-wrapper`, `.custom-size-input`
   - Used by vanilla `index.html`

10. **Export Button** (lines 481-516)
    - `.export-button`, `.export-button-disabled`
    - Used by vanilla `index.html`

11. **Main Content** (lines 527-551)
    - `.main`, `.icon-grid`
    - Used by vanilla `index.html`

12. **Icon Cards** (lines 685-770)
    - `.card`, `.card-selected`, `.card-selection-button`, `.card-selection-icon`, `.iconBox`, `.muted`
    - Used by vanilla `index.html`

13. **Toast Notifications** (lines 796-834)
    - `.toast`, `.toast.show`, `.selected-count-toast`, `.selected-count-toast.show`
    - Used by vanilla `index.html`

14. **Responsive Styles** (lines 836-870)
    - Mobile/tablet media queries
    - Used by vanilla `index.html`

### ❌ Already Removed

1. **Input/Select CSS** (previously lines 553-677)
   - ✅ Removed - React uses Tailwind
   - Note left: "NOTE: Input/Select styles removed - React app uses Tailwind CSS"

2. **`.export-hint`** (previously lines 518-525)
   - ✅ Removed - unused

3. **`.card-name`** (previously lines 772-789)
   - ✅ Removed - unused (cards use title attribute)

## Summary

**Total lines in site.css**: ~725 lines

**Status**: 
- All remaining CSS is used by vanilla `index.html`
- React app doesn't use any of it
- Can be safely removed if vanilla HTML is removed

## Recommendations

### If Keeping Vanilla HTML as Fallback:
- ✅ Keep `site.css` as-is
- All styles are still needed for vanilla page

### If Removing Vanilla HTML:
- ❌ Delete `site.css` entirely
- React app is self-contained with Tailwind

### If Archiving:
- Move `site.css` to `vanilla-backup/css/`
- Keep for reference but not in production

