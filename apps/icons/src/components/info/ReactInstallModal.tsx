/**
 * ReactInstallModal
 * -----------------
 * Install/import guide modal for the React icon package.
 * Rebuilt with design-system tokens and the existing CodeSnippet component.
 *
 * Usage:
 *   <ReactInstallModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     packageName="@someicons/icons-react"
 *     selectedIconName="ArrowLeft"
 *   />
 */

import { CodeSnippet } from '@/components/info/CodeSnippetGroup'
import { ReactSnippetLazy } from '@/components/info/ReactSnippetLazy'
import { trackInstallModalCopy } from '@/lib/analytics'
import reactLogo from '../../../assets/images/logo-react.svg'
import { useMemo, useState } from 'react'
import { ChipButton } from 'design-system'
import { createPortal } from 'react-dom'

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

export interface PackageManager {
  id: string
  label: string
  cmd: (pkg: string) => string
}

export interface ImportMode {
  id: string
  label: string
  code: (args: { pkg: string; iconName: string }) => string
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_PACKAGE_MANAGERS: PackageManager[] = [
  { id: 'npm',  label: 'npm',  cmd: (pkg) => `npm install ${pkg}` },
  { id: 'yarn', label: 'yarn', cmd: (pkg) => `yarn add ${pkg}` },
  { id: 'pnpm', label: 'pnpm', cmd: (pkg) => `pnpm add ${pkg}` },
  { id: 'bun',  label: 'bun',  cmd: (pkg) => `bun add ${pkg}` },
]

export const DEFAULT_IMPORT_MODES: ImportMode[] = [
  {
    id: 'selected',
    label: 'selected',
    code: ({ pkg, iconName }) => `import { ${iconName} } from '${pkg}'`,
  },
  {
    id: 'all',
    label: 'all',
    code: ({ pkg }) => `import * as Icons from '${pkg}'`,
  },
]

// ---------------------------------------------------------------------------
// Inline tab strip — sits inside a CodeSnippet header via headerTabsSlot
// ---------------------------------------------------------------------------

interface InlineTabStripProps {
  items: { id: string; label: string }[]
  activeId: string
  onChange: (id: string) => void
  ariaLabel: string
}

function InlineTabStrip({ items, activeId, onChange, ariaLabel }: InlineTabStripProps) {
  return (
    <div className="rii-modal__codeTabList" role="tablist" aria-label={ariaLabel}>
      {items.map((item) => (
        <ChipButton
          key={item.id}
          role="tab"
          aria-selected={activeId === item.id}
          className="homepage-codeSnippetTab"
          labelSize="md"
          compoundShell
          variant={activeId === item.id ? 'strong' : 'transparent'}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </ChipButton>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ReactInstallModalProps {
  open?: boolean
  onClose?: () => void
  packageName?: string
  selectedIconName?: string
  packageManagers?: PackageManager[]
  importModes?: ImportMode[]
  flavorLabel?: string
  title?: string
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export function ReactInstallModal({
  open = true,
  onClose,
  packageName = '@someicons/icons-react',
  selectedIconName = 'IconName',
  packageManagers = DEFAULT_PACKAGE_MANAGERS,
  importModes = DEFAULT_IMPORT_MODES,
  flavorLabel = 'React component',
  title = 'Install once, import only what you use.',
}: ReactInstallModalProps) {
  const [activePmId, setActivePmId] = useState(packageManagers[0]?.id ?? 'npm')
  const [activeModeId, setActiveModeId] = useState(importModes[0]?.id ?? 'selected')
  const [installCopied, setInstallCopied] = useState(false)
  const [importCopied, setImportCopied] = useState(false)

  const activePm = useMemo(
    () => packageManagers.find((p) => p.id === activePmId) ?? packageManagers[0],
    [packageManagers, activePmId],
  )
  const activeMode = useMemo(
    () => importModes.find((m) => m.id === activeModeId) ?? importModes[0],
    [importModes, activeModeId],
  )

  const installCmd = activePm?.cmd(packageName) ?? ''
  const importCode = activeMode?.code({ pkg: packageName, iconName: selectedIconName }) ?? ''

  const handleCopy = async (
    text: string,
    setCopied: (v: boolean) => void,
    section: 'install' | 'import',
  ) => {
    try {
      await navigator.clipboard.writeText(text)
      trackInstallModalCopy({
        section,
        package_manager: section === 'install' ? activePmId : undefined,
        import_mode: section === 'import' ? activeModeId : undefined,
      })
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // clipboard not available — silent
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="rii-scrim"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="rii-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Install ${packageName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <header className="rii-hero">
          <button
            type="button"
            className="rii-close"
            aria-label="Close"
            onClick={onClose}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              width={18}
              height={18}
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <span className="rii-eyebrow">
            <img
              src={reactLogo}
              alt=""
              width={14}
              height={14}
              className="rii-eyebrow__mark"
              aria-hidden
              decoding="async"
            />
            {flavorLabel}
          </span>

          <h2 className="rii-title">{title}</h2>
          <code className="rii-package">{packageName}</code>
        </header>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="rii-body">

          {/* Install */}
          <div className="rii-codeFrame">
            <CodeSnippet
              label="install"
              copied={installCopied}
              onCopy={() => void handleCopy(installCmd, setInstallCopied, 'install')}
              copyAriaLabel={installCopied ? 'Copied install command' : 'Copy install command'}
              headerTabsSlot={
                <InlineTabStrip
                  ariaLabel="Package manager"
                  items={packageManagers}
                  activeId={activePmId}
                  onChange={setActivePmId}
                />
              }
            >
              <pre className="rii-codeBlock">
                <span className="rii-tok--dim">{'$ '}</span>
                <span className="rii-tok--cmd">{installCmd}</span>
              </pre>
            </CodeSnippet>
          </div>

          {/* Import */}
          <div className="rii-codeFrame">
            <CodeSnippet
              label="import"
              copied={importCopied}
              onCopy={() => void handleCopy(importCode, setImportCopied, 'import')}
              copyAriaLabel={importCopied ? 'Copied import' : 'Copy import'}
              headerTabsSlot={
                <InlineTabStrip
                  ariaLabel="Import style"
                  items={importModes}
                  activeId={activeModeId}
                  onChange={setActiveModeId}
                />
              }
            >
              <ReactSnippetLazy
                code={importCode}
                className="rii-codeBlock"
              />
            </CodeSnippet>
          </div>

        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ReactInstallModal
