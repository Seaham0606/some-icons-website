import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'node:fs'

/**
 * Icon set version shown in the header chip: the highest version in content/changelog
 * (entries with `scope: "website"` frontmatter are site releases and are ignored).
 */
function latestIconSetVersion(): string {
  const dir = path.resolve(__dirname, 'content/changelog')
  const versions = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8'))
    .filter((src) => !/^scope:\s*["']?website["']?\s*$/m.test(src.split(/^---\s*$/m)[1] ?? ''))
    .map((src) => /^version:\s*["']?([\d.]+)["']?\s*$/m.exec(src)?.[1])
    .filter((v): v is string => !!v)
  const cmp = (a: string, b: string) => {
    const [x, y] = [a, b].map((v) => v.split('.').map(Number))
    for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0)
    return 0
  }
  return versions.sort(cmp).at(-1) ?? '0.0.0'
}

// https://vite.dev/config/
export default defineConfig({
  define: { __ICON_SET_VERSION__: JSON.stringify(latestIconSetVersion()) },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure the workspace design-system uses the same React as the app (avoids invalid hook call / blank page)
    dedupe: ['react', 'react-dom'],
  },
  // Don’t pre-bundle the linked design-system package: it can drop non-DOM props (e.g. leadingSlot)
  // on Button and serve a stale cache. Source-transform the workspace package instead.
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['design-system'],
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
