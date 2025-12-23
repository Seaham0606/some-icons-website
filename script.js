const BASE_URL = "https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/";

let ICONS = [];

const elSearch = document.getElementById("search");
const elStyleControl = document.getElementById("style-control");
const elCategory = document.getElementById("category");
const elGrid = document.getElementById("grid");
const elToast = document.getElementById("toast");
const elSelectedCountToast = document.getElementById("selected-count-toast");
const elColorInput = document.getElementById("color-input");
const elColorPicker = document.getElementById("color-picker");
const elColorEyedropper = document.getElementById("color-eyedropper-icon");
const elColorReset = document.getElementById("color-reset-icon");

const svgCache = new Map();
let selectedColor = null; // null = Default mode (currentColor), string = custom hex color
let selectedIconIds = new Set(); // Track selected icon IDs

function getStyleValue() {
  if (!elStyleControl) return "outline";
  const activeButton = elStyleControl.querySelector(".segment-button.active");
  return activeButton ? activeButton.dataset.value : "outline";
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort();
}

function showToast(message) {
  elToast.textContent = message;
  elToast.classList.add("show");
  setTimeout(() => elToast.classList.remove("show"), 2000);
}

function updateSelectedCountToast() {
  const count = selectedIconIds.size;
  if (elSelectedCountToast) {
    if (count > 0) {
      elSelectedCountToast.textContent = `Selected: ${count}`;
      elSelectedCountToast.classList.add("show");
    } else {
      elSelectedCountToast.classList.remove("show");
    }
  }
}

function toggleIconSelection(iconId) {
  if (selectedIconIds.has(iconId)) {
    selectedIconIds.delete(iconId);
  } else {
    selectedIconIds.add(iconId);
  }
  updateSelectedCountToast();
  updateExportButtonState();
  // Re-render to update card styling
  render();
}

async function loadIndex() {
  const res = await fetch(`${BASE_URL}index.json`, { cache: "no-store" });
  const data = await res.json();
  ICONS = data.icons || [];
}

function buildCategories() {
  elCategory.innerHTML = `<option value="all">All icons</option>`;
  const cats = uniq(ICONS.map((i) => i.category).filter(Boolean));
  
  const sortedCats = [...cats];
  const generalIndex = sortedCats.indexOf("general");
  if (generalIndex > -1) {
    sortedCats.splice(generalIndex, 1);
    sortedCats.unshift("general");
  }
  
  sortedCats.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    elCategory.appendChild(opt);
  });
}

function normalizeQuery(s) {
  return (s || "").trim().toLowerCase();
}

function isValidHexColor(hex) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

function normalizeHexColor(hex) {
  if (!hex) return "#000000";
  hex = hex.trim();
  if (!hex.startsWith("#")) {
    hex = "#" + hex;
  }
  if (hex.length === 4) {
    // Convert #RGB to #RRGGBB
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

function updateColor(newColor) {
  // Handle "Default" / currentColor mode
  const isDefault = 
    newColor === "Default" ||
    newColor === "default" ||
    newColor === "currentColor" ||
    newColor === "" ||
    newColor == null;

  if (isDefault) {
    selectedColor = null; // null = Default mode
    if (elColorInput) {
      elColorInput.value = "";
      elColorInput.classList.add("color-input-default");
    }
    if (elColorPicker) {
      elColorPicker.value = "#000000";
    }
    updateColorUI();
    render();
    return;
  }

  const normalized = normalizeHexColor(newColor);
  if (isValidHexColor(normalized)) {
    selectedColor = normalized;
    if (elColorInput) {
      elColorInput.value = normalized.toUpperCase();
      elColorInput.classList.remove("color-input-default");
    }
    if (elColorPicker) {
      elColorPicker.value = normalized;
    }
    updateColorUI();
    render();
  }
}

function updateColorUI() {
  // Show/hide eyedropper overlay on color picker
  if (selectedColor === null) {
    // Default mode: show eyedropper overlay on color picker, hide reset
    if (elColorEyedropper) elColorEyedropper.style.display = "block";
    if (elColorPicker) elColorPicker.style.opacity = "0";
    if (elColorReset) elColorReset.style.display = "none";
    if (elColorInput) {
      elColorInput.classList.add("color-input-default");
      // Ensure value is empty to show placeholder
      if (elColorInput.value === "" || elColorInput.value.toLowerCase() === "default") {
        elColorInput.value = "";
      }
    }
  } else {
    // Custom color mode: hide eyedropper overlay, show color picker swatch and reset
    if (elColorEyedropper) elColorEyedropper.style.display = "none";
    if (elColorPicker) elColorPicker.style.opacity = "1";
    if (elColorReset) elColorReset.style.display = "block";
    if (elColorInput) elColorInput.classList.remove("color-input-default");
  }
}

function resetColor() {
  updateColor("Default");
}

function applyColorToSvg(svgText, color) {
  // In Default mode (null), keep the original SVG colors (including currentColor)
  if (color === null) {
    return svgText;
  }

  let s = svgText;
  
  // Replace currentColor first
  s = s.replaceAll("currentColor", color);
  
  // Replace hex colors in fill attributes, but preserve "none", "transparent", etc.
  // Matches: fill="#111", fill='#000000', fill="#abc", but not fill="none"
  s = s.replace(/(fill\s*=\s*["']?)(#?[0-9a-fA-F]{3,6})(["']?)/gi, (match, p1, colorValue, p3) => {
    // Don't replace if it's a special value
    const lower = colorValue.toLowerCase();
    if (lower === 'none' || lower === 'transparent' || lower === 'inherit') {
      return match;
    }
    return p1 + color + p3;
  });
  
  // Replace hex colors in stroke attributes
  s = s.replace(/(stroke\s*=\s*["']?)(#?[0-9a-fA-F]{3,6})(["']?)/gi, (match, p1, colorValue, p3) => {
    const lower = colorValue.toLowerCase();
    if (lower === 'none' || lower === 'transparent' || lower === 'inherit') {
      return match;
    }
    return p1 + color + p3;
  });
  
  // Replace colors in style attributes (fill: #111; or stroke: #000;)
  s = s.replace(/(fill\s*:\s*)(#?[0-9a-fA-F]{3,6})(\s*;?)/gi, (match, p1, colorValue, p3) => {
    const lower = colorValue.toLowerCase();
    if (lower === 'none' || lower === 'transparent' || lower === 'inherit') {
      return match;
    }
    return p1 + color + p3;
  });
  s = s.replace(/(stroke\s*:\s*)(#?[0-9a-fA-F]{3,6})(\s*;?)/gi, (match, p1, colorValue, p3) => {
    const lower = colorValue.toLowerCase();
    if (lower === 'none' || lower === 'transparent' || lower === 'inherit') {
      return match;
    }
    return p1 + color + p3;
  });
  
  // Replace common color names (black, white) in fill/stroke, but preserve special values
  s = s.replace(/(fill\s*=\s*["']?)(black|white|Black|White|BLACK|WHITE)(["']?)/gi, (match, p1, colorName, p3) => {
    return p1 + color + p3;
  });
  s = s.replace(/(stroke\s*=\s*["']?)(black|white|Black|White|BLACK|WHITE)(["']?)/gi, (match, p1, colorName, p3) => {
    return p1 + color + p3;
  });
  
  return s;
}

function matches(icon, q) {
  if (!q) return true;
  return `${icon.id} ${icon.category} ${(icon.tags || []).join(" ")}`
    .toLowerCase()
    .includes(q);
}

async function fetchSvgText(icon, style) {
  const relPath = icon.files?.[style];
  const key = `${style}:${relPath}`;
  if (svgCache.has(key)) return svgCache.get(key);

  const res = await fetch(`${BASE_URL}${relPath}`, { cache: "no-store" });
  const text = await res.text();
  svgCache.set(key, text);
  return text;
}

async function loadUIIcon(iconId, containerId, style = "outline") {
  const icon = ICONS.find((i) => i.id === iconId);
  if (!icon || !icon.files?.[style]) return;

  const svg = await fetchSvgText(icon, style);
  let s = svg;
  if (!/\bviewBox=/i.test(s)) {
    s = s.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
  }
  
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
    
    // For reset and eyedropper icons, inject SVG directly so we can style it with CSS
    if (containerId === "color-reset-icon" || containerId === "color-eyedropper-icon") {
      container.innerHTML = s;
      const svgElement = container.querySelector("svg");
      if (svgElement) {
        svgElement.style.width = "100%";
        svgElement.style.height = "100%";
        svgElement.style.display = "block";
      }
    } else {
      s = s.replaceAll("currentColor", "#000000");
      const encoded = encodeURIComponent(s)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml,${encoded}`;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.style.opacity = "0.3";
      container.appendChild(img);
    }
  }
}

async function loadUIIcons() {
  await loadUIIcon("general-search", "search-icon", "filled");
  await loadUIIcon("arrow-down-triangle", "style-icon", "filled");
  await loadUIIcon("arrow-down-triangle", "category-icon", "filled");
  await loadUIIcon("general-eyedropper", "color-eyedropper-icon", "filled");
  await loadUIIcon("arrow-repeat", "color-reset-icon", "outline");
}

async function loadSelectionIcon(container, isSelected) {
  const targetIconId = isSelected ? "general-button-radio-selected" : "general-button-radio";
  const targetIcon = ICONS.find((i) => i.id === targetIconId);
  if (!targetIcon || !targetIcon.files?.filled) return;
  
  const svg = await fetchSvgText(targetIcon, "filled");
  let s = svg;
  if (!/\bviewBox=/i.test(s)) {
    s = s.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
  }
  
  container.innerHTML = s;
  const svgElement = container.querySelector("svg");
  if (svgElement) {
    svgElement.style.width = "100%";
    svgElement.style.height = "100%";
    svgElement.style.display = "block";
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("SVG copied to clipboard!");
  }).catch(() => {
    showToast("Failed to copy");
  });
}

function initFooter() {
  const year = new Date().getFullYear();
  const footerContent = document.getElementById("footer-content");
  if (footerContent) {
    footerContent.innerHTML = `© ${year} Sihan Liu · <a href="https://github.com/Seaham0606/some-icons-cdn" target="_blank">GitHub</a> · <a href="https://choosealicense.com/licenses/mit/" target="_blank">MIT License</a>`;
  }
}

function render() {
  const q = normalizeQuery(elSearch.value);

  const filtered = ICONS.filter((icon) => {
    if (!q && elCategory.value !== "all" && icon.category !== elCategory.value)
      return false;
    if (!icon.files?.[getStyleValue()])
      return false;
    return matches(icon, q);
  });

  elGrid.innerHTML = "";

  filtered.forEach((icon) => {
    const style = getStyleValue();
    const isSelected = selectedIconIds.has(icon.id);
    const card = document.createElement("div");
    card.className = "card";
    if (isSelected) {
      card.classList.add("card-selected");
    }
    card.title = icon.id;

    // Selection control button
    const selectionButton = document.createElement("button");
    selectionButton.className = "card-selection-button";
    selectionButton.setAttribute("aria-pressed", isSelected);
    selectionButton.setAttribute("aria-label", `Select ${icon.id}`);
    selectionButton.type = "button";
    const selectionIcon = document.createElement("div");
    selectionIcon.className = "card-selection-icon";
    selectionButton.appendChild(selectionIcon);
    
    // Load selection icon
    (async () => {
      await loadSelectionIcon(selectionIcon, isSelected);
    })();
    
    selectionButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleIconSelection(icon.id);
    });
    
    card.appendChild(selectionButton);

    const box = document.createElement("div");
    box.className = "iconBox";
    box.innerHTML = `<span class="muted">…</span>`;
    card.appendChild(box);

    const name = document.createElement("div");
    name.className = "card-name";
    name.textContent = icon.id;
    card.appendChild(name);

    (async () => {
      const svg = await fetchSvgText(icon, style);
      let s = svg;
      if (!/\bviewBox=/i.test(s)) {
        s = s.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
      }
      s = applyColorToSvg(s, selectedColor);
      const encoded = encodeURIComponent(s)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
      const img = document.createElement("img");
      img.src = `data:image/svg+xml,${encoded}`;
      box.innerHTML = "";
      box.appendChild(img);
    })();

    card.onclick = async (e) => {
      // If in multi-select mode (at least one icon selected), toggle selection instead of copying
      if (selectedIconIds.size > 0) {
        // Don't toggle if clicking the selection button (it handles its own click)
        if (e.target.closest('.card-selection-button')) {
          return;
        }
        toggleIconSelection(icon.id);
        return;
      }
      
      // Normal mode: copy SVG to clipboard
      const svg = await fetchSvgText(icon, style);
      let s = svg;
      if (!/\bviewBox=/i.test(s)) {
        s = s.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
      }
      s = applyColorToSvg(s, selectedColor);
      copyToClipboard(s);
    };

    elGrid.appendChild(card);
  });
}

elSearch.addEventListener("focus", (e) => {
  // Clear placeholder on focus so it disappears immediately
  e.target.placeholder = "";
});

elSearch.addEventListener("blur", (e) => {
  // Restore placeholder when not focused and empty
  if (e.target.value === "") {
    e.target.placeholder = "Search icons";
  }
});

elSearch.oninput = render;
elCategory.onchange = render;

// Style control handler
if (elStyleControl) {
  elStyleControl.addEventListener("click", (e) => {
    if (e.target.classList.contains("segment-button")) {
      const value = e.target.dataset.value;
      
      // Remove active class from all buttons
      elStyleControl.querySelectorAll(".segment-button").forEach(btn => {
        btn.classList.remove("active");
      });
      
      // Add active class to clicked button
      e.target.classList.add("active");
      
      render();
    }
  });
}

// Color input handlers
elColorInput.addEventListener("input", (e) => {
  const value = e.target.value;
  const trimmed = value.trim();

  // Allow user to type "Default" (case-insensitive) to go back to Default mode
  if (trimmed.toLowerCase() === "default") {
    updateColor("Default");
    return;
  }

  // If empty, stay in Default mode but don't update (let user continue typing)
  if (trimmed === "") {
    return;
  }

  // Convert hex values to uppercase as user types
  if (value.startsWith("#") || /^[0-9A-Fa-f]+$/.test(value.replace("#", ""))) {
    const cursorPos = e.target.selectionStart;
    e.target.value = value.toUpperCase();
    e.target.setSelectionRange(cursorPos, cursorPos);
  }

  if (isValidHexColor(normalizeHexColor(value))) {
    updateColor(value);
  }
});

elColorInput.addEventListener("focus", (e) => {
  // Clear the field when focused so placeholder disappears immediately
  // This ensures the placeholder is hidden as soon as user clicks
  if (selectedColor === null) {
    e.target.value = "";
    e.target.placeholder = "";
  }
});

elColorInput.addEventListener("blur", (e) => {
  const value = e.target.value.trim();
  if (value && isValidHexColor(normalizeHexColor(value))) {
    updateColor(value);
  } else {
    // Reset to Default mode if empty or invalid
    if (selectedColor === null) {
      e.target.value = "";
      e.target.placeholder = "Default";
    } else {
      // Restore the valid color value
      e.target.value = selectedColor.toUpperCase();
      e.target.placeholder = "Default";
    }
  }
});

elColorInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.target.blur();
  }
});

elColorPicker.addEventListener("input", (e) => {
  updateColor(e.target.value);
});

// Click handler for color picker container - make entire area clickable when eyedropper is visible
const elColorPickerContainer = document.querySelector(".color-picker-container");
if (elColorPickerContainer && elColorPicker) {
  // The color picker input itself is always clickable
  // When eyedropper is visible, clicking the container should also trigger the picker
  elColorPickerContainer.addEventListener("click", (e) => {
    // If not clicking the input directly, trigger it
    if (e.target !== elColorPicker) {
      e.preventDefault();
      elColorPicker.click();
    }
  });
}

// Reset color button handler
if (elColorReset) {
  elColorReset.addEventListener("click", (e) => {
    e.stopPropagation();
    resetColor();
  });
}

// Export panel handlers
let selectedSize = null;
let selectedFormat = null;
const elSizeControl = document.getElementById("size-control");
const elFormatControl = document.getElementById("format-control");
const elCustomSizeInput = document.getElementById("custom-size-input");
const elExportButton = document.getElementById("export-button");

// Size control handler
if (elSizeControl) {
  elSizeControl.addEventListener("click", (e) => {
    if (e.target.classList.contains("segment-button")) {
      const value = e.target.dataset.value;
      
      // Remove active class from all buttons
      elSizeControl.querySelectorAll(".segment-button").forEach(btn => {
        btn.classList.remove("active");
      });
      
      // Add active class to clicked button
      e.target.classList.add("active");
      
      // Clear custom input when a preset is selected
      if (elCustomSizeInput) {
        elCustomSizeInput.value = "";
        elCustomSizeInput.blur();
      }
      
      selectedSize = parseInt(value);
    }
  });
}

// Handle focus on custom input - remove active from buttons
if (elCustomSizeInput) {
  elCustomSizeInput.addEventListener("focus", () => {
    if (elSizeControl) {
      elSizeControl.querySelectorAll(".segment-button").forEach(btn => {
        btn.classList.remove("active");
      });
    }
  });
}

// Custom size input handler
if (elCustomSizeInput) {
  elCustomSizeInput.addEventListener("input", (e) => {
    const value = parseInt(e.target.value);
    if (value && value > 0) {
      selectedSize = value;
    }
  });
  
  elCustomSizeInput.addEventListener("blur", (e) => {
    const value = parseInt(e.target.value);
    if (!value || value <= 0) {
      e.target.value = "";
    }
  });
}

// Format control handler
if (elFormatControl) {
  elFormatControl.addEventListener("click", (e) => {
    if (e.target.classList.contains("segment-button")) {
      const value = e.target.dataset.value;
      
      // Remove active class from all buttons
      elFormatControl.querySelectorAll(".segment-button").forEach(btn => {
        btn.classList.remove("active");
      });
      
      // Add active class to clicked button
      e.target.classList.add("active");
      selectedFormat = value;
    }
  });
}

function updateExportButtonState() {
  const hasSelection = selectedIconIds.size > 0;
  const exportHint = document.getElementById("export-hint");
  
  if (elExportButton) {
    elExportButton.disabled = !hasSelection;
    if (!hasSelection) {
      elExportButton.classList.add("export-button-disabled");
    } else {
      elExportButton.classList.remove("export-button-disabled");
    }
  }
  
  if (exportHint) {
    if (hasSelection) {
      exportHint.style.display = "none";
    } else {
      exportHint.style.display = "block";
    }
  }
}

function formatDateTimeForFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

async function exportSelectedIcons() {
  if (selectedIconIds.size === 0) {
    showToast("Please select icons to export");
    return;
  }
  
  const style = getStyleValue();
  const size = selectedSize || 24;
  const format = selectedFormat || "svg";
  
  const selectedIcons = Array.from(selectedIconIds)
    .map(id => ICONS.find(icon => icon.id === id))
    .filter(Boolean)
    .filter(icon => icon.files?.[style]);
  
  if (selectedIcons.length === 0) {
    showToast("No valid icons to export");
    return;
  }
  
  // Check if JSZip is available
  if (typeof JSZip === 'undefined') {
    showToast("Zip library not loaded. Please refresh the page.");
    return;
  }
  
  const zip = new JSZip();
  const dateTime = formatDateTimeForFilename();
  const iconCount = selectedIcons.length;
  const zipFilename = `some-icons-${dateTime}-${iconCount}.zip`;
  
  if (format === "svg") {
    // Prepare SVG files for zip
    for (const icon of selectedIcons) {
      const svg = await fetchSvgText(icon, style);
      let s = svg;
      if (!/\bviewBox=/i.test(s)) {
        s = s.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
      }
      s = applyColorToSvg(s, selectedColor);
      
      // Update SVG size if needed
      if (size !== 16) {
        s = s.replace(/width="[^"]*"/i, `width="${size}"`);
        s = s.replace(/height="[^"]*"/i, `height="${size}"`);
        if (!s.includes('viewBox')) {
          s = s.replace(/<svg/i, `<svg viewBox="0 0 16 16"`);
        }
      }
      
      zip.file(`${icon.id}.svg`, s);
    }
    
    // Generate and download zip
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Exported ${selectedIcons.length} SVG file(s) as ZIP`);
  } else if (format === "png") {
    // Prepare PNG files for zip
    for (const icon of selectedIcons) {
      const svg = await fetchSvgText(icon, style);
      let s = svg;
      if (!/\bviewBox=/i.test(s)) {
        s = s.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
      }
      s = applyColorToSvg(s, selectedColor);
      
      // Update SVG size
      s = s.replace(/width="[^"]*"/i, `width="${size}"`);
      s = s.replace(/height="[^"]*"/i, `height="${size}"`);
      if (!s.includes('viewBox')) {
        s = s.replace(/<svg/i, `<svg viewBox="0 0 16 16"`);
      }
      
      // Convert SVG to PNG
      const pngBlob = await new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([s], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, size, size);
          
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert to PNG"));
            }
          }, "image/png");
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load SVG"));
        };
        img.src = url;
      });
      
      zip.file(`${icon.id}.png`, pngBlob);
    }
    
    // Generate and download zip
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`Exported ${selectedIcons.length} PNG file(s) as ZIP`);
  }
}

// Export button handler
if (elExportButton) {
  elExportButton.addEventListener("click", () => {
    exportSelectedIcons();
  });
}

(async () => {
  await loadIndex();
  buildCategories();
  await loadUIIcons();
  initFooter();
  updateColorUI(); // Initialize UI state
  updateSelectedCountToast(); // Initialize selected count toast
  updateExportButtonState(); // Initialize export button state
  render();
})();

