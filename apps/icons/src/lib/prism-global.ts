import { Prism } from 'prism-react-renderer'

/**
 * `prismjs/components/*` scripts use the global `Prism` identifier. They must run only after this
 * side effect (import `prism-global` before any `prismjs/components/...` in the same graph).
 */
const g = globalThis as typeof globalThis & { Prism: typeof Prism }
g.Prism = Prism
