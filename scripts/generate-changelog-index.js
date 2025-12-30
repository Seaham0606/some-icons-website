/**
 * Changelog Index Generator
 * 
 * Scans /content/changelog/*.md files, extracts frontmatter,
 * and generates a JSON index file for the changelog page.
 */

const fs = require('fs');
const path = require('path');

const CHANGELOG_DIR = path.join(__dirname, '..', 'content', 'changelog');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'js', 'changelog-index.json');

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  const frontmatter = {};
  
  // Parse YAML-like frontmatter (simple key-value pairs)
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body };
}

/**
 * Process inline markdown (bold, italic, code, links)
 */
function processInlineMarkdown(text) {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic (but not if it's part of bold)
    .replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/**
 * Convert markdown to HTML (basic implementation)
 * For production, consider using a proper markdown parser like marked or markdown-it
 */
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  // Split into lines for processing
  const lines = markdown.split('\n');
  const result = [];
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let listItems = [];
  
  function flushList() {
    if (listItems.length > 0) {
      const tag = listType === 'ol' ? 'ol' : 'ul';
      result.push(`<${tag}>`);
      listItems.forEach(item => {
        result.push(`  <li>${item}</li>`);
      });
      result.push(`</${tag}>`);
      listItems = [];
      inList = false;
      listType = null;
    }
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check for headers (with or without space after #)
    const headerMatch = trimmed.match(/^(#{1,6})(.+)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const text = headerMatch[2].trim();
      result.push(`<h${level}>${text}</h${level}>`);
      continue;
    }
    
    // Check for unordered list item (- or *)
    if (trimmed.match(/^[-*]\s/)) {
      let itemText = trimmed.substring(2).trim();
      // Process inline markdown in list items
      itemText = processInlineMarkdown(itemText);
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(itemText);
      continue;
    }
    
    // Check for ordered list item (1. 2. etc.)
    if (trimmed.match(/^\d+\.\s/)) {
      let itemText = trimmed.replace(/^\d+\.\s/, '').trim();
      // Process inline markdown in list items
      itemText = processInlineMarkdown(itemText);
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(itemText);
      continue;
    }
    
    // Empty line - flush list and add paragraph break
    if (trimmed === '') {
      flushList();
      if (result.length > 0 && !result[result.length - 1].match(/^<(h[1-6]|ul|ol|pre|hr)/)) {
        // Don't add empty paragraphs after headers, lists, etc.
      }
      continue;
    }
    
    // If last element was a header and this line doesn't start with #, treat as list item
    const lastElement = result[result.length - 1];
    if (lastElement && lastElement.match(/^<h[1-6]>/) && !trimmed.match(/^#/)) {
      // Treat as list item (even without - or *)
      let itemText = processInlineMarkdown(trimmed);
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(itemText);
      continue;
    }
    
    // Regular line - flush list first, then process as paragraph
    flushList();
    
    // Process inline markdown
    let processedLine = processInlineMarkdown(trimmed);
    
    result.push(`<p>${processedLine}</p>`);
  }
  
  // Flush any remaining list
  flushList();
  
  // Process code blocks (do this after to avoid interfering with list processing)
  let html = result.join('\n');
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  
  return html;
}

/**
 * Generate anchor ID from title
 */
function generateAnchorId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Process a single changelog file
 */
function processChangelogFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    if (!frontmatter.title || !frontmatter.version) {
      console.warn(`Skipping ${filePath}: missing required frontmatter (title, version)`);
      return null;
    }
    
    const title = frontmatter.title;
    const version = frontmatter.version;
    const date = frontmatter.date || null;
    const htmlContent = markdownToHtml(body.trim());
    const anchorId = generateAnchorId(`${version}-${title}`);
    
    return {
      title,
      version,
      date,
      content: htmlContent,
      anchorId
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate changelog index
 */
function generateIndex() {
  if (!fs.existsSync(CHANGELOG_DIR)) {
    console.warn(`Changelog directory not found: ${CHANGELOG_DIR}`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ entries: [] }, null, 2));
    return;
  }
  
  const files = fs.readdirSync(CHANGELOG_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(CHANGELOG_DIR, file);
      return processChangelogFile(filePath);
    })
    .filter(entry => entry !== null);
  
  // Sort by date descending (newest first), then by version descending as tiebreaker
  files.sort((a, b) => {
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
  
  const index = {
    entries: files
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Generated changelog index with ${files.length} entries: ${OUTPUT_FILE}`);
}

// Run if called directly
if (require.main === module) {
  generateIndex();
}

module.exports = { generateIndex };

