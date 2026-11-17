import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "es2022",
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  // react/react-dom are peer deps; runtime deps are externalized automatically by tsup.
  external: ["react", "react-dom"],
  // Inline SVG assets as data URLs so consumers don't need an SVG loader.
  loader: {
    ".svg": "dataurl",
  },
  // Note: the "use client" directive is added in scripts/postbuild.mjs because
  // esbuild strips module-level directives when bundling.
})
