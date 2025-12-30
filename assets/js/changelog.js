/**
 * Changelog Page Script
 * 
 * Loads and renders changelog entries from the generated index.
 */

// Determine the correct path for the changelog index
function getChangelogIndexUrl() {
  const path = window.location.pathname;
  // If we're at /changelog/index.html, use relative path
  if (path.includes('/changelog/') || path.endsWith('/changelog')) {
    return '../assets/js/changelog-index.json';
  }
  // If we're at /changelog.html or root, use root-relative path
  return '/assets/js/changelog-index.json';
}

let changelogEntries = [];

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Parse markdown-like content (basic implementation)
 * In a real scenario, you might want to use a markdown parser
 */
function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  // Basic markdown parsing - convert to HTML
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = '<p>' + html + '</p>';
  }
  
  return html;
}

/**
 * Format date string
 */
function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Render a single changelog entry
 */
function renderEntry(entry) {
  const dateStr = formatDate(entry.date);
  const content = entry.content || '';
  
  return `
    <article class="changelog-entry" id="${entry.anchorId || ''}">
      <header class="changelog-entry-header">
        <div class="changelog-entry-meta">
          <h2 class="changelog-entry-title">
            <a href="#${entry.anchorId || ''}" class="changelog-entry-link">${escapeHtml(entry.title)}</a>
          </h2>
          <div class="changelog-entry-info">
            <span class="changelog-entry-version">${escapeHtml(entry.version)}</span>
            ${dateStr ? `<span class="changelog-entry-date">${escapeHtml(dateStr)}</span>` : ''}
          </div>
        </div>
      </header>
      <div class="changelog-entry-content changelog-content">
        ${content}
      </div>
    </article>
  `;
}

/**
 * Render version history list in sidebar
 */
function renderVersionList() {
  const container = document.getElementById('changelog-versions-list');
  if (!container) return;

  if (changelogEntries.length === 0) {
    container.innerHTML = '<div class="changelog-empty">No versions yet.</div>';
    return;
  }

  try {
    const versionsHtml = changelogEntries.map(entry => {
      const version = escapeHtml(entry.version);
      const title = escapeHtml(entry.title);
      const anchorId = entry.anchorId || '';
      return `
        <a href="#${anchorId}" class="changelog-version-link">${version}</a>
      `;
    });
    container.innerHTML = versionsHtml.join('');
  } catch (error) {
    console.error('Error rendering version list:', error);
    container.innerHTML = '<div class="changelog-error">Error loading versions.</div>';
  }
}

/**
 * Render all changelog entries
 */
async function renderChangelog() {
  const container = document.getElementById('changelog-entries');
  if (!container) return;

  if (changelogEntries.length === 0) {
    container.innerHTML = `
      <div class="changelog-empty">
        <p>No changelog entries yet.</p>
        <p class="changelog-empty-hint">Add Markdown files to <code>content/changelog/</code> to see them here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '<div class="changelog-loading">Loading entries...</div>';

  try {
    const entriesHtml = changelogEntries.map(entry => renderEntry(entry));
    container.innerHTML = entriesHtml.join('');
  } catch (error) {
    console.error('Error rendering changelog:', error);
    container.innerHTML = `
      <div class="changelog-error">
        <p>Error loading changelog entries.</p>
        <p class="changelog-error-hint">Please try refreshing the page.</p>
      </div>
    `;
  }
}

/**
 * Load changelog index
 */
async function loadChangelogIndex() {
  try {
    const url = getChangelogIndexUrl();
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load changelog index: ${response.status}`);
    }
    
    const data = await response.json();
    changelogEntries = data.entries || [];
    
    // Sort by date descending (newest first), then by version descending as tiebreaker
    changelogEntries.sort((a, b) => {
      // Parse dates
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      
      // If dates are valid and different, sort by date
      if (!isNaN(dateA) && !isNaN(dateB) && dateA !== dateB) {
        return dateB - dateA; // Newest first
      }
      
      // If dates are the same or invalid, sort by version number (newest first)
      // Parse version numbers (e.g., "15.1.1" -> [15, 1, 1])
      const parseVersion = (version) => {
        if (!version) return [0, 0, 0];
        const parts = version.replace(/^v/i, '').split('.').map(Number);
        // Pad to 3 parts for comparison
        while (parts.length < 3) parts.push(0);
        return parts;
      };
      
      const versionA = parseVersion(a.version);
      const versionB = parseVersion(b.version);
      
      // Compare version parts
      for (let i = 0; i < 3; i++) {
        if (versionB[i] !== versionA[i]) {
          return versionB[i] - versionA[i]; // Higher version first
        }
      }
      
      // If versions are the same, invalid dates go to the end
      if (isNaN(dateA) && !isNaN(dateB)) return 1;
      if (!isNaN(dateA) && isNaN(dateB)) return -1;
      
      return 0;
    });
    
    renderVersionList();
    await renderChangelog();
  } catch (error) {
    console.error('Error loading changelog index:', error);
    const container = document.getElementById('changelog-entries');
    if (container) {
      container.innerHTML = `
        <div class="changelog-error">
          <p>Error loading changelog.</p>
          <p class="changelog-error-hint">Please check your connection and try again.</p>
        </div>
      `;
    }
  }
}

/**
 * Initialize theme toggle
 */
function initThemeToggle() {
  const toggle = document.getElementById('changelog-theme-toggle');
  if (!toggle) return;

  // Set initial state
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    toggle.checked = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    toggle.checked = false;
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // Handle toggle
  toggle.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      toggle.checked = e.matches;
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Initialize footer
 */
function initFooter() {
  const year = new Date().getFullYear();
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = year.toString();
  } else {
    console.warn("Footer year element not found");
  }
}

/**
 * Load arrow-left-chevron icon from CDN
 */
async function loadBackIcon() {
  const BASE_URL = "https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/";
  
  try {
    // First, we need to get the icon index to find the arrow-left-chevron icon
    const indexRes = await fetch(`${BASE_URL}index.json`, { cache: "no-store" });
    const indexData = await indexRes.json();
    const icons = indexData.icons || [];
    
    const arrowIcon = icons.find(icon => icon.id === 'arrow-left-chevron');
    if (!arrowIcon) {
      console.warn('Arrow-left-chevron icon not found');
      return;
    }
    
    // Load the outline style SVG
    const svgPath = arrowIcon.files?.outline;
    if (!svgPath) {
      console.warn('Arrow-left-chevron icon SVG path not found');
      return;
    }
    
    const svgRes = await fetch(`${BASE_URL}${svgPath}`, { cache: "no-store" });
    const svgText = await svgRes.text();
    
    // Inject SVG into icon container
    const iconContainer = document.getElementById('back-icon');
    if (iconContainer) {
      let svg = svgText;
      // Ensure viewBox is set (icons are typically 16x16 or 24x24)
      if (!/\bviewBox=/i.test(svg)) {
        svg = svg.replace(/<svg/i, '<svg viewBox="0 0 24 24"');
      }
      iconContainer.innerHTML = svg;
      const svgElement = iconContainer.querySelector('svg');
      if (svgElement) {
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.display = 'block';
        svgElement.style.color = 'inherit';
      }
    }
  } catch (error) {
    console.error('Error loading back icon:', error);
  }
}

/**
 * Handle smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  // Handle clicks on version links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.changelog-version-link');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without jumping
          history.pushState(null, '', href);
        }
      }
    }
  });
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initFooter();
  loadBackIcon();
  initSmoothScrolling();
  loadChangelogIndex();
});

