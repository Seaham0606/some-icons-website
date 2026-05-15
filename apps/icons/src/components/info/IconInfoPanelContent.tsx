import { IconWireframe } from '@/components/info/IconWireframe'
import { DEFAULT_ICON_SIZE } from '@/lib/constants'
import {
  generateFrameworkCodeSnippet,
  getDefaultCodeFramework,
} from '@/lib/code-export'
import { useColorStore } from '@/stores/colorStore'
import { useExportStore } from '@/stores/exportStore'
import { useFilterStore } from '@/stores/filterStore'
import type { Icon } from '@/types/icon'
import { Button, InputSection } from 'design-system'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

export interface IconInfoPanelContentProps {
  icon: Icon
}

export function IconInfoPanelContent({ icon }: IconInfoPanelContentProps) {
  const exportSize = useExportStore((s) => s.size)
  const selectedColor = useColorStore((s) => s.selectedColor)
  const style = useFilterStore((s) => s.style)

  const reactSnippet = useMemo(
    () =>
      generateFrameworkCodeSnippet(getDefaultCodeFramework(), {
        orderedIconIds: [icon.id],
        style,
        size: exportSize ?? DEFAULT_ICON_SIZE,
        colorHex: selectedColor,
      }),
    [icon.id, style, exportSize, selectedColor],
  )

  const handleCopySnippet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reactSnippet)
    } catch (error) {
      console.error('Clipboard copy failed:', error)
      toast.error('Could not copy. Check clipboard permissions.')
    }
  }, [reactSnippet])

  return (
    <InputSection
      className="homepage-infoPanelShell"
      showLabel={false}
      contentSlot={
        <div className="homepage-infoPanelContent">
          <IconWireframe icon={icon} />

          <div className="homepage-infoPanelContent__meta" data-slot="infoPanel-meta">
            <p className="homepage-infoPanelContent__metaId">{icon.id}</p>
            <p className="homepage-infoPanelContent__metaCategory">{icon.category}</p>
          </div>

          <div
            className="homepage-infoPanelContent__framework"
            data-slot="infoPanel-framework"
            aria-label="Code platform selector (placeholder)"
          >
            React (only platform for now)
          </div>

          <div
            className="homepage-infoPanelContent__exportActions"
            data-slot="infoPanel-exportActions"
          >
            <Button type="button" variant="secondary" size="md" radius="md" disabled>
              Copy
            </Button>
            <Button type="button" variant="secondary" size="md" radius="md" disabled>
              Download
            </Button>
          </div>

          <InputSection
            className="homepage-infoPanelContent__snippetSection"
            label="Code snippet"
            trailingSlot={
              <Button
                type="button"
                variant="transparent"
                size="sm"
                radius="md"
                aria-label="Copy React code"
                iconName="interface-copy"
                iconStyle="outline"
                contentColor="var(--color-main-quaternary)"
                onClick={() => {
                  void handleCopySnippet()
                }}
                data-slot="infoPanel-snippet-copy"
              />
            }
            contentSlot={
              <div
                className="homepage-infoPanelContent__snippet"
                data-slot="infoPanel-snippet"
              >
                <pre className="homepage-infoPanelContent__snippetPlaceholder">
                  <code>{reactSnippet}</code>
                </pre>
              </div>
            }
          />
        </div>
      }
    />
  )
}
