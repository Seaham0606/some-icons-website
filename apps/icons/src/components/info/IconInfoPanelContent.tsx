import type { Icon } from '@/types/icon'
import { Button, InputSection } from 'design-system'

export interface IconInfoPanelContentProps {
  icon: Icon
}

/** Phase 0: layout shell only — placeholders for preview, exports, snippet, frameworks. */
export function IconInfoPanelContent({ icon }: IconInfoPanelContentProps) {
  return (
    <InputSection
      className="homepage-infoPanelShell"
      showLabel={false}
      contentSlot={
        <div className="homepage-infoPanelContent">
          <div
            className="homepage-infoPanelContent__preview"
            data-slot="infoPanel-preview"
            aria-hidden
          />

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
              <span
                className="homepage-infoPanelContent__snippetHelp"
                data-slot="infoPanel-snippet-help"
              >
                Instructions (placeholder)
              </span>
            }
            trailingColor="var(--color-main-tertiary)"
            contentSlot={
              <div
                className="homepage-infoPanelContent__snippet"
                data-slot="infoPanel-snippet"
              >
                <pre className="homepage-infoPanelContent__snippetPlaceholder">
                  <code>{`// Snippet placeholder`}</code>
                </pre>
              </div>
            }
          />
        </div>
      }
    />
  )
}
