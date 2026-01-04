/**
 * Local Development Server
 * 
 * Simple Express server for local development only.
 * Provides API endpoint for generating changelog files.
 * 
 * Usage: node server.js
 * 
 * This server should NOT be deployed to production.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { generateIndex } = require('./scripts/generate-changelog-index');

// Start changelog watcher in development
let changelogWatcher = null;
if (process.env.NODE_ENV !== 'production') {
  try {
    const { watchChangelog } = require('./scripts/watch-changelog');
    changelogWatcher = watchChangelog();
    console.log('[Server] Changelog watcher started');
  } catch (error) {
    console.warn('[Server] Could not start changelog watcher:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 8000;

// Function to find an available port
function findAvailablePort(startPort, callback) {
  const net = require('net');
  const server = net.createServer();
  
  server.listen(startPort, () => {
    const port = server.address().port;
    server.close(() => {
      callback(port);
    });
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // Port is in use, try next port
      findAvailablePort(startPort + 1, callback);
    } else {
      callback(startPort); // Use requested port if other error
    }
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// API routes - must come before static file serving
app.post('/api/generate-changelog', (req, res) => {
  try {
    const { filename, content } = req.body;
    
    // Validate inputs
    if (!filename || !content) {
      return res.status(400).json({ error: 'Filename and content are required' });
    }
    
    // Validate filename format (must be vX.Y.Z.md)
    if (!/^v\d+\.\d+\.\d+\.md$/.test(filename)) {
      return res.status(400).json({ error: 'Filename must be in format vX.Y.Z.md' });
    }
    
    // Ensure content/changelog directory exists
    const changelogDir = path.join(__dirname, 'content', 'changelog');
    if (!fs.existsSync(changelogDir)) {
      fs.mkdirSync(changelogDir, { recursive: true });
    }
    
    // Write file
    const filePath = path.join(changelogDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
    
    console.log(`Generated changelog file: ${filePath}`);
    
    // Regenerate changelog index
    try {
      generateIndex();
      console.log('Changelog index regenerated');
    } catch (indexError) {
      console.error('Error regenerating changelog index:', indexError);
      // Don't fail the request if index generation fails
    }
    
    res.json({ 
      success: true, 
      filename,
      message: `Successfully generated ${filename}` 
    });
    
  } catch (error) {
    console.error('Error generating changelog:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate changelog file' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Changelog generator API is running' });
});

// Serve React app static files (if built)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Serve other static assets (images, etc.)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/content', express.static(path.join(__dirname, 'content')));

// SPA fallback - serve React app index.html for all routes
// This must come after static file serving
app.get('*', (req, res) => {
  // If dist exists (production build), serve from there
  if (fs.existsSync(distPath)) {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  // React build doesn't exist - show helpful error
  res.status(503).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Build Required</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          h1 { margin-top: 0; color: #333; }
          code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>⚠️ React Build Required</h1>
          <p>The React app needs to be built before it can be served.</p>
          <p>Run: <code>cd react && npm run build</code></p>
        </div>
      </body>
    </html>
  `);
});

// Start server
if (process.env.PORT) {
  // If PORT is explicitly set, use it (may fail if in use)
  app.listen(PORT, () => {
    console.log(`Local development server running on http://localhost:${PORT}`);
      console.log(`Changelog generator available at http://localhost:${PORT}/generator`);
    console.log('\n⚠️  This server is for local development only. Do not deploy to production.');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use.`);
      console.error(`   Please stop the other server or use a different port:`);
      console.error(`   PORT=8001 npm run dev\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });
} else {
  // Auto-find available port starting from 8000
  findAvailablePort(PORT, (availablePort) => {
    app.listen(availablePort, () => {
      console.log(`Local development server running on http://localhost:${availablePort}`);
      console.log(`Changelog generator available at http://localhost:${availablePort}/generator`);
      if (availablePort !== PORT) {
        console.log(`\n⚠️  Port ${PORT} was in use, using port ${availablePort} instead.`);
      }
      console.log('\n⚠️  This server is for local development only. Do not deploy to production.');
    });
  });
}

