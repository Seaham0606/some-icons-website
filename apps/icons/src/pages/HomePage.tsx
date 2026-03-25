import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import { PageContent } from '@/components/layout/PageContent'
import { useUIStore } from '@/stores/uiStore'
import {
  Button,
  Input,
  InputField,
  InputSection,
  InputSectionSlotPlaceholder,
  SegmentedControl,
  Sidebar,
  SomeIcon,
  ThemeButton,
} from 'design-system'
import { getHighestVersion, useChangelog } from '@/hooks/useChangelog'
import { useState } from 'react'

function HomeThemeButton() {
  const setTheme = useUIStore((s) => s.setTheme)
  const mode = useUIStore((s) => s.getEffectiveTheme())
  return (
    <ThemeButton
      mode={mode}
      onToggle={() =>
        setTheme(useUIStore.getState().getEffectiveTheme() === 'dark' ? 'light' : 'dark')
      }
    />
  )
}

const STYLE_SEGMENT_OPTIONS = [
  { value: 'a' as const, label: 'Outline' },
  { value: 'b' as const, label: 'Filled' },
]

const EXPORT_SIZE_OPTIONS = [
  { value: 16 as const, label: '16' },
  { value: 20 as const, label: '20' },
  { value: 24 as const, label: '24' },
  { value: 32 as const, label: '32' },
]

const EXPORT_FORMAT_OPTIONS = [
  { value: 'svg' as const, label: 'SVG' },
  { value: 'png' as const, label: 'PNG' },
]

export default function HomePage() {
  const { data: entries } = useChangelog()
  const version = getHighestVersion(entries)
  const [demoSeg2, setDemoSeg2] = useState<'a' | 'b'>('a')
  const [exportSize, setExportSize] = useState<16 | 20 | 24 | 32 | null>(null)
  const [exportFormat, setExportFormat] = useState<'svg' | 'png' | null>(null)

  return (
    <div className="homepage-shell">
      <Sidebar
        pageName="Icon library"
        version={version}
        logo={
          <img
            src={logoSymbol}
            alt="Some Icons"
            width={28}
            height={28}
            className="ds-sidebar__logoIcon"
          />
        }
        themeButton={<HomeThemeButton />}
        socialButtons={
          <div className="ds-sidebar__social">
            <a
              href="https://www.figma.com/community/plugin/1581870303104890341/some-icons"
              target="_blank"
              rel="noreferrer"
              className="ds-sidebar__socialLink"
              aria-label="Figma community plugin"
            >
              <img
                src={figmaIcon}
                alt="Figma"
                className="ds-sidebar__socialIconImg"
              />
            </a>
            <a
              href="https://github.com/Seaham0606/some-icons-cdn"
              target="_blank"
              rel="noreferrer"
              className="ds-sidebar__socialLink"
              aria-label="GitHub repository"
            >
              <span
                aria-hidden="true"
                className="ds-sidebar__socialIconMask"
                style={{
                  backgroundColor: 'var(--color-main-primary)',
                  WebkitMaskImage: `url("${githubIcon}")`,
                  maskImage: `url("${githubIcon}")`,
                  maskMode: 'alpha',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
            </a>
          </div>
        }
      >
        <InputSection
          showLabel={false}
          contentSlot={
            <>
              <InputField
                showLabel={false}
                contentSlot={
                  <Input
                    placeholder="Search"
                    leadingSlot={
                      <SomeIcon
                        iconName="interface-search"
                        iconStyle="outline"
                        iconSize="md"
                        padding="2"
                      />
                    }
                  />
                }
              />
              <InputField
                label="Style"
                contentSlot={
                  <SegmentedControl
                    options={STYLE_SEGMENT_OPTIONS}
                    value={demoSeg2}
                    onChange={setDemoSeg2}
                  />
                }
              />
              <InputField
                label="Category"
                contentSlot={<InputSectionSlotPlaceholder />}
              />
            </>
          }
        />
        <InputSection
          label="Customize"
          leadSlot={
            <SomeIcon
              iconName="formatting-pencil-alt"
              iconStyle="outline"
              iconSize="sm"
            />
          }
          leadColor="var(--color-main-secondary)"
          contentSlot={
            <InputField
              label="Color"
              showCol2
              col2Width="size-12"
              contentSlot={
                <Input
                  disabled
                  defaultValue="Default"
                  contentColor="var(--color-main-disabled)"
                  trailingSlot={
                    <SomeIcon
                      iconName="arrow-undo"
                      iconStyle="outline"
                      iconSize="md"
                      padding="2"
                    />
                  }
                />
              }
              secondarySlot={
                <Input
                  leadingSlot={
                    <SomeIcon
                      iconName="formatting-eyedropper"
                      iconStyle="outline"
                      iconSize="md"
                      padding="2"
                    />
                  }
                  showTrailing={false}
                />
              }
            />
          }
        />
        <InputSection
          label="Export"
          leadSlot={
            <SomeIcon
              iconName="arrow-up-out"
              iconStyle="outline"
              iconSize="sm"
            />
          }
          leadColor="var(--color-main-secondary)"
          contentSlot={
            <>
              <InputField
                label="Size"
                showCol2
                col2Width="size-12"
                contentSlot={
                  <SegmentedControl<16 | 20 | 24 | 32>
                    options={EXPORT_SIZE_OPTIONS}
                    value={exportSize}
                    onChange={setExportSize}
                  />
                }
                secondarySlot={
                  <Input showLeading={false} showTrailing={false} defaultValue="" />
                }
              />
              <InputField
                label="Format"
                contentSlot={
                  <SegmentedControl<'svg' | 'png'>
                    options={EXPORT_FORMAT_OPTIONS}
                    value={exportFormat}
                    onChange={setExportFormat}
                  />
                }
              />
              <Button
                variant="primary"
                fullWidth={true}
                size="lg"
                radius="lg"
                aria-label="Export"
              >
                Export
              </Button>
            </>
          }
        />
      </Sidebar>

      <main className="homepage-main">
        <PageContent />
      </main>
    </div>
  )
}
