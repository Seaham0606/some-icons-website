const BASE_URL = "https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/";

let ICONS = [];

const elSearch = document.getElementById("search");
const elStyle = document.getElementById("style");
const elCategory = document.getElementById("category");
const elGrid = document.getElementById("grid");
const elToast = document.getElementById("toast");

const svgCache = new Map();

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
    if (!icon.files?.[elStyle.value])
      return false;
    return matches(icon, q);
  });

  elGrid.innerHTML = "";

  filtered.forEach((icon) => {
    const style = elStyle.value;
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
      s = s.replaceAll("currentColor", "#111");
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
      copyToClipboard(svg);
    };

    elGrid.appendChild(card);
  });
}

elSearch.oninput = render;
elStyle.onchange = render;
elCategory.onchange = render;

(async () => {
  await loadIndex();
  buildCategories();
  await loadUIIcons();
  initFooter();
  render();
})();

