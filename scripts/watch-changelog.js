/**
 * Changelog Watch Script
 * 
 * Watches the content/changelog/ directory for changes and automatically
 * regenerates the changelog-index.json file when markdown files are
 * added, modified, or deleted.
 */

const fs = require('fs');
const path = require('path');
const { generateIndex } = require('./generate-changelog-index');

const CHANGELOG_DIR = path.join(__dirname, '..', 'content', 'changelog');

// Track if we're currently generating to avoid multiple simultaneous runs
let isGenerating = false;
let generationTimeout = null;

/**
 * Debounced generation function
 * Waits 300ms after the last change before regenerating
 */
function debouncedGenerate() {
  if (generationTimeout) {
    clearTimeout(generationTimeout);
  }
  
  generationTimeout = setTimeout(() => {
    if (!isGenerating) {
      isGenerating = true;
      console.log('\n[Changelog Watch] Changes detected, regenerating index...');
      
      try {
        generateIndex();
        console.log('[Changelog Watch] ✓ Index regenerated successfully\n');
      } catch (error) {
        console.error('[Changelog Watch] ✗ Error regenerating index:', error);
      } finally {
        isGenerating = false;
      }
    }
  }, 300);
}

/**
 * Watch the changelog directory for changes
 */
function watchChangelog() {
  if (!fs.existsSync(CHANGELOG_DIR)) {
    console.error(`[Changelog Watch] Error: Directory not found: ${CHANGELOG_DIR}`);
    console.error('[Changelog Watch] Creating directory...');
    fs.mkdirSync(CHANGELOG_DIR, { recursive: true });
  }

  console.log(`[Changelog Watch] Watching directory: ${CHANGELOG_DIR}`);
  console.log('[Changelog Watch] Waiting for changes... (Press Ctrl+C to stop)\n');

  // Generate initial index
  try {
    generateIndex();
    console.log('[Changelog Watch] ✓ Initial index generated\n');
  } catch (error) {
    console.error('[Changelog Watch] ✗ Error generating initial index:', error);
  }

  // Watch for changes
  // Note: fs.watch can be unreliable on macOS, but it's the simplest solution
  // For better reliability, consider using chokidar package
  const watcher = fs.watch(CHANGELOG_DIR, { recursive: true }, (eventType, filename) => {
    // filename can be null on some systems
    if (!filename) return;
    
    // Only process markdown files
    if (filename.endsWith('.md')) {
      const filePath = path.join(CHANGELOG_DIR, filename);
      
      // Check if file exists (for delete events, it won't exist)
      const fileExists = fs.existsSync(filePath);
      
      if (eventType === 'rename') {
        if (fileExists) {
          console.log(`[Changelog Watch] File added/modified: ${filename}`);
        } else {
          console.log(`[Changelog Watch] File deleted: ${filename}`);
        }
      } else if (eventType === 'change') {
        console.log(`[Changelog Watch] File changed: ${filename}`);
      }
      
      debouncedGenerate();
    }
  });

  // Handle errors
  watcher.on('error', (error) => {
    console.error('[Changelog Watch] Watch error:', error);
  });

  // Return watcher so it can be closed if needed
  return watcher;
}

// Export function for use in other modules
module.exports = { watchChangelog };

// Start watching if run directly
if (require.main === module) {
  watchChangelog();
}

