import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const src = resolve(root, "src")
const dist = resolve(root, "dist")

// 1) Copy stylesheets as-is (not bundled) so consumers import them directly.
// Relative @import paths inside tokens/index.css are preserved by mirroring the folder layout.
const files = [
  ["components.css", "components.css"],
  ["tokens/index.css", "tokens/index.css"],
  ["tokens/theme.css", "tokens/theme.css"],
  ["tokens/semantic.css", "tokens/semantic.css"],
  ["tokens/scrollbar.css", "tokens/scrollbar.css"],
]

await mkdir(resolve(dist, "tokens"), { recursive: true })

for (const [from, to] of files) {
  await cp(resolve(src, from), resolve(dist, to))
}

// 2) Re-add the "use client" directive. esbuild strips module-level directives when
// bundling, so we prepend it here to keep the bundle compatible with React Server
// Component setups (e.g. Next.js App Router).
const entry = resolve(dist, "index.js")
const code = await readFile(entry, "utf8")
const directive = '"use client";\n'
if (!code.startsWith('"use client"') && !code.startsWith("'use client'")) {
  await writeFile(entry, directive + code)
}

console.log(`Copied ${files.length} stylesheet(s) and ensured "use client" directive.`)
