/**
 * Changelog Generator Page Script
 * 
 * Handles form submission and markdown generation for changelog entries.
 */

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
 * Convert multiline text to bullet list items
 */
function textToBulletItems(text) {
  if (!text || !text.trim()) return [];
  
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Generate markdown content from form data
 */
function generateMarkdown(formData) {
  const version = formData.get('version').trim();
  const date = formData.get('date');
  const title = formData.get('title').trim();
  const summary = formData.get('summary').trim();
  const releaseType = formData.get('release_type');
  
  // Build YAML front matter
  const frontmatter = [
    '---',
    `version: "${version}"`,
    `date: "${date}"`,
    `title: "${title}"`,
    `summary: "${summary}"`,
    `release_type: "${releaseType}"`,
    '---',
    ''
  ].join('\n');
  
  // Build content sections
  const sections = [];
  
  const sectionMap = {
    'Added': formData.get('added'),
    'Changed': formData.get('changed'),
    'Fixed': formData.get('fixed'),
    'Removed': formData.get('removed'),
    'Deprecated': formData.get('deprecated'),
    'Notes': formData.get('notes')
  };
  
  for (const [sectionName, sectionValue] of Object.entries(sectionMap)) {
    const items = textToBulletItems(sectionValue);
    if (items.length > 0) {
      sections.push(`## ${sectionName}`);
      items.forEach(item => {
        sections.push(`- ${item}`);
      });
      sections.push(''); // Empty line after section
    }
  }
  
  // Remove trailing empty lines
  while (sections.length > 0 && sections[sections.length - 1] === '') {
    sections.pop();
  }
  
  return frontmatter + sections.join('\n');
}

/**
 * Extract version number and generate filename
 */
function generateFilename(version) {
  // Remove 'v' prefix if present and ensure format is X.Y.Z
  const cleanVersion = version.replace(/^v/i, '');
  
  // Validate version format (basic check)
  if (!/^\d+\.\d+\.\d+/.test(cleanVersion)) {
    throw new Error('Version must be in format X.Y.Z (e.g., 1.2.0)');
  }
  
  return `v${cleanVersion}.md`;
}

/**
 * Show message to user
 */
function showMessage(message, type = 'success') {
  const messageEl = document.getElementById('form-message');
  if (!messageEl) return;
  
  messageEl.textContent = message;
  messageEl.className = `generator-message ${type}`;
  
  // Clear message after 5 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      messageEl.textContent = '';
      messageEl.className = 'generator-message';
    }, 5000);
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const generateButton = document.getElementById('generate-button');
  const messageEl = document.getElementById('form-message');
  
  // Clear previous messages
  if (messageEl) {
    messageEl.textContent = '';
    messageEl.className = 'generator-message';
  }
  
  // Disable button during submission
  if (generateButton) {
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';
  }
  
  try {
    // Generate markdown
    const markdown = generateMarkdown(formData);
    const version = formData.get('version').trim();
    const filename = generateFilename(version);
    
    // Send to server endpoint
    let response;
    try {
      // Try the API endpoint
      response = await fetch('/api/generate-changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          content: markdown
        })
      });
      
      // If we get a 501, the server doesn't support POST - try downloading instead
      if (response.status === 501) {
        throw new Error('Server does not support API endpoint. Please run: npm run dev (or node server.js)');
      }
    } catch (fetchError) {
      // Network error - server probably not running
      console.error('Network error:', fetchError);
      throw new Error('Cannot connect to server. Make sure the dev server is running (npm run dev or node server.js)');
    }
    
    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch (textError) {
          // Ignore text parsing errors
        }
      }
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    showMessage(`Successfully generated ${filename}`, 'success');
    
    // Optionally reset form
    // form.reset();
    
  } catch (error) {
    console.error('Error generating changelog:', error);
    const errorMessage = error.message || 'Failed to generate changelog. Make sure the dev server is running.';
    showMessage(errorMessage, 'error');
  } finally {
    // Re-enable button
    if (generateButton) {
      generateButton.disabled = false;
      generateButton.textContent = 'Generate Changelog';
    }
  }
}

/**
 * Load calendar icon from CDN
 */
async function loadCalendarIcon() {
  const BASE_URL = "https://raw.githubusercontent.com/Seaham0606/some-icons-cdn/main/";
  
  try {
    // First, we need to get the icon index to find the calendar icon
    const indexRes = await fetch(`${BASE_URL}index.json`, { cache: "no-store" });
    const indexData = await indexRes.json();
    const icons = indexData.icons || [];
    
    const calendarIcon = icons.find(icon => icon.id === 'general-calendar');
    if (!calendarIcon) {
      console.warn('Calendar icon not found');
      return;
    }
    
    // Load the filled style SVG
    const svgPath = calendarIcon.files?.filled;
    if (!svgPath) {
      console.warn('Calendar icon SVG path not found');
      return;
    }
    
    const svgRes = await fetch(`${BASE_URL}${svgPath}`, { cache: "no-store" });
    const svgText = await svgRes.text();
    
    // Inject SVG into date icon container
    const dateIconContainer = document.getElementById('date-icon');
    if (dateIconContainer) {
      let svg = svgText;
      if (!/\bviewBox=/i.test(svg)) {
        svg = svg.replace(/<svg/i, '<svg viewBox="0 0 16 16"');
      }
      dateIconContainer.innerHTML = svg;
      const svgElement = dateIconContainer.querySelector('svg');
      if (svgElement) {
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.display = 'block';
      }
    }
  } catch (error) {
    console.error('Error loading calendar icon:', error);
  }
}

/**
 * Initialize release type segmented control
 */
function initReleaseTypeControl() {
  const control = document.getElementById('release-type-control');
  const hiddenInput = document.getElementById('release_type');
  
  if (!control || !hiddenInput) return;
  
  // Handle clicks on segment buttons
  control.addEventListener('click', (e) => {
    if (e.target.classList.contains('segment-button')) {
      const value = e.target.dataset.value;
      
      // Remove active class from all buttons
      control.querySelectorAll('.segment-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      e.target.classList.add('active');
      
      // Update hidden input
      hiddenInput.value = value;
      
      // Remove required validation error if present
      hiddenInput.setCustomValidity('');
    }
  });
  
  // Validate on form submit - check before the main handler
  const form = document.getElementById('changelog-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!hiddenInput.value) {
        e.preventDefault();
        e.stopPropagation();
        hiddenInput.setCustomValidity('Please select a release type');
        hiddenInput.reportValidity();
        const generateButton = document.getElementById('generate-button');
        if (generateButton) {
          generateButton.disabled = false;
          generateButton.textContent = 'Generate Changelog';
        }
        return false;
      }
    }, true); // Use capture phase to run before other handlers
  }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReleaseTypeControl();
  loadCalendarIcon();
  
  const form = document.getElementById('changelog-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  // Set default date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
});

