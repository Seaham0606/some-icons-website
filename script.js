const BASE_URL = "https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/";

let ICONS = [];

const elSearch = document.getElementById("search");
const elStyleControl = document.getElementById("style-control");
const elCategory = document.getElementById("category");
const elGrid = document.getElementById("grid");
const elToast = document.getElementById("toast");
const elColorInput = document.getElementById("color-input");
const elColorPicker = document.getElementById("color-picker");

const svgCache = new Map();
let selectedColor = "#000000";

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
  const normalized = normalizeHexColor(newColor);
  if (isValidHexColor(normalized)) {
    selectedColor = normalized;
    elColorInput.value = normalized;
    elColorPicker.value = normalized;
    render();
  }
}

function resetColor() {
  updateColor("#000000");
}

function applyColorToSvg(svgText, color) {
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
  s = s.replaceAll("currentColor", "#000000");
  const encoded = encodeURIComponent(s)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
    const img = document.createElement("img");
    img.src = `data:image/svg+xml,${encoded}`;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.opacity = "0.3";
    container.appendChild(img);
  }
}

async function loadUIIcons() {
  await loadUIIcon("general-search", "search-icon", "filled");
  await loadUIIcon("arrow-down-triangle", "style-icon", "filled");
  await loadUIIcon("arrow-down-triangle", "category-icon", "filled");
  await loadUIIcon("arrow-repeat", "color-reset-icon", "outline");
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
    const card = document.createElement("div");
    card.className = "card";
    card.title = icon.id;

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

    card.onclick = async () => {
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
  if (isValidHexColor(normalizeHexColor(value))) {
    updateColor(value);
  }
});

elColorInput.addEventListener("blur", (e) => {
  const value = e.target.value;
  if (value && isValidHexColor(normalizeHexColor(value))) {
    updateColor(value);
  } else {
    // Reset to current valid color if invalid
    elColorInput.value = selectedColor;
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

// Reset color button handler
const elColorReset = document.getElementById("color-reset-icon");
if (elColorReset) {
  elColorReset.addEventListener("click", resetColor);
}

// Export panel handlers
let selectedSize = 16;
let selectedFormat = "svg";
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

// Export button handler
if (elExportButton) {
  elExportButton.addEventListener("click", () => {
    // TODO: Implement export functionality
    showToast("Export functionality coming soon!");
  });
}

(async () => {
  await loadIndex();
  buildCategories();
  await loadUIIcons();
  initFooter();
  render();
})();

