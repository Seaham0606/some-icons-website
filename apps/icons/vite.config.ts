import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure design-system and Radix use the app's React (prevents "Invalid hook call" / blank page)
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'design-system'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Ensure assets are referenced correctly from root
    assetsDir: 'assets',
  },
  // For development, serve from root
  base: '/',
})
