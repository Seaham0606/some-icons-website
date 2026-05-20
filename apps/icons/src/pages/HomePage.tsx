import logoSymbol from '../../assets/images/logo-some-icons-symbol.svg'
import figmaIcon from '../../assets/images/logo-figma-icon.svg'
import githubIcon from '../../assets/images/logo-github-icon.svg'
import {
  GradientOverlay,
  GRADIENT_OVERLAY_HOME_HEIGHT_PX,
} from '@/components/overlay/GradientOverlay'
import { IconGrid } from '@/components/icons/IconGrid'
import { HomeCategoryList, HomePageFilterStack } from '@/components/home/HomePageFilters'
import { PageContent } from '@/components/layout'
import { useSelectionStore } from '@/stores/selectionStore'
import { useFilterStore } from '@/stores/filterStore'
import { useUIStore } from '@/stores/uiStore'
import {
  BulkActionBar,
  Button,
  Chip,
  cn,
  InfoPanel,
  Input,
  InputField,
  InputSection,
  Sidebar,
  SiteFooter,
  SiteHeader,
  SomeIcon,
} from 'design-system'
import { IconInfoPanelContent } from '@/components/info/IconInfoPanelContent'
import { IconInfoPanelHeader } from '@/components/info/IconInfoPanelHeader'
import { ThemeButton } from '@/components/ThemeButton'
import { useBackdropPresence } from '@/hooks/useBackdropPresence'
import { useFilteredGridIcons } from '@/hooks/useFilteredGridIcons'
import { useIcons } from '@/hooks/useIcons'
import { useChangelog } from '@/hooks/useChangelog'
import type { Icon } from '@/types/icon'
import gsap from 'gsap'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'


/** Inverse chip on hover/focus — below the control (IconCard filename pattern). */
function BulkActionHoverChip({
  chipLabel,
  children,
}: {
  chipLabel: string
  children: ReactNode
}) {
  return (
    <div className="homepage-bulkAction-hoverWrap">
      {children}
      <div className="homepage-bulkAction-hoverMeta" aria-hidden>
        <Chip variant="inverse" backdropBlur>
          {chipLabel}
        </Chip>
      </div>
    </div>
  )
}

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

export default function HomePage() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const iconStyle = useFilterStore((s) => s.style)
  const setIconStyle = useFilterStore((s) => s.setStyle)
  useChangelog()
  const [headerCategoryOpen, setHeaderCategoryOpen] = useState(false)
  const [mobileSearchOverlayOpen, setMobileSearchOverlayOpen] = useState(false)
  const navChromeRef = useRef<HTMLDivElement>(null)
  const categoryPanelId = useId()
  const bulkBarsWrapRef = useRef<HTMLDivElement>(null)
  const prevBulkSelectionCountRef = useRef(0)
  const prevSelectionCountRef = useRef(0)
  const prevAutoSelectCountRef = useRef(0)
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const [infoPanelIcon, setInfoPanelIcon] = useState<Icon | null>(null)
  const { data: allIcons } = useIcons()
  const categoryNavBackdrop = useBackdropPresence(headerCategoryOpen)
  const selectionCount = useSelectionStore((s) => s.count)
  const clearSelection = useSelectionStore((s) => s.clear)
  useLayoutEffect(() => {
    if (selectionCount === 0) {
      prevBulkSelectionCountRef.current = 0
      return
    }
    const el = bulkBarsWrapRef.current
    if (!el) return

    const enteringFromZero = prevBulkSelectionCountRef.current === 0
    prevBulkSelectionCountRef.current = selectionCount

    if (!enteringFromZero) return

    gsap.killTweensOf(el)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { clearProps: 'transform' })
      return
    }
    gsap.fromTo(
      el,
      { yPercent: 40 },
      {
        yPercent: 0,
        duration: 0.45,
        ease: 'power3.out',
      },
    )
  }, [selectionCount])

  const visibleGridIcons = useFilteredGridIcons()
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const selectAllVisible = useSelectionStore((s) => s.selectAll)
  const deselectMany = useSelectionStore((s) => s.deselectMany)

  const visibleIds = useMemo(
    () => visibleGridIcons.map((icon) => icon.id),
    [visibleGridIcons],
  )

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id))

  const handleToggleSelectAllVisible = useCallback(() => {
    if (visibleIds.length === 0) return
    if (allVisibleSelected) {
      deselectMany(visibleIds)
    } else {
      selectAllVisible(visibleIds)
    }
  }, [allVisibleSelected, deselectMany, selectAllVisible, visibleIds])

  const scrollLocked = headerCategoryOpen || categoryNavBackdrop.mounted

  useLayoutEffect(() => {
    const el = navChromeRef.current
    if (!el) return

    const syncNavChromeHeight = () => {
      el.style.setProperty('--homepage-nav-chrome-height', `${el.offsetHeight}px`)
    }

    syncNavChromeHeight()
    const observer = new ResizeObserver(syncNavChromeHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [headerCategoryOpen, mobileSearchOverlayOpen])

  useEffect(() => {
    if (!scrollLocked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [scrollLocked])


  const handleInfoPanelClose = useCallback(() => {
    setInfoPanelOpen(false)
    setInfoPanelIcon(null)
    clearSelection()
  }, [clearSelection])

  const handleInfoOpen = useCallback((icon: Icon) => {
    setInfoPanelIcon(icon)
    setInfoPanelOpen(true)
  }, [])

  useEffect(() => {
    if (!infoPanelOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') handleInfoPanelClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [infoPanelOpen, handleInfoPanelClose])

  // When the InfoPanel is open from a single-click and the user starts
  // checkbox-selecting other icons, auto-select the anchor icon on the first
  // 0→N transition so it's included in the multi-select snippet.
  // Uses a ref so the effect only fires on that transition — NOT on every
  // subsequent selection change. Without the ref, deselecting the anchor would
  // immediately re-add it because the effect would see it missing and re-select.
  useEffect(() => {
    const prev = prevAutoSelectCountRef.current
    prevAutoSelectCountRef.current = selectionCount
    if (
      prev === 0 &&
      selectionCount > 0 &&
      infoPanelOpen &&
      infoPanelIcon &&
      !selectedIds.has(infoPanelIcon.id)
    ) {
      // Prepend anchor so insertion order is [panel icon, …new picks], not the reverse.
      useSelectionStore.setState((state) => {
        const next = new Set([infoPanelIcon.id, ...state.selectedIds])
        return { selectedIds: next, count: next.size }
      })
    }
  }, [selectionCount, infoPanelOpen, infoPanelIcon, selectedIds])

  // When the anchor icon is deselected but other icons remain selected, shift
  // the panel focus to the first icon in the current selection (insertion order).
  // This un-highlights the original trigger card and highlights the new first icon.
  useEffect(() => {
    if (!infoPanelOpen || selectionCount === 0 || !infoPanelIcon) return
    if (selectedIds.has(infoPanelIcon.id)) return
    const firstId = [...selectedIds][0]
    if (!firstId || !allIcons) return
    const newAnchor = allIcons.find((ic) => ic.id === firstId)
    if (newAnchor) setInfoPanelIcon(newAnchor)
  }, [infoPanelOpen, selectionCount, infoPanelIcon, selectedIds, allIcons])

  // Close InfoPanel when every icon is deselected (covers checkbox deselect,
  // BulkActionBar Clear, download-then-clear, etc.). Uses a ref so the check
  // is "count just dropped to 0" rather than "count is currently 0" — the
  // latter would fire on first render and when InfoPanel opens with no selection.
  useEffect(() => {
    const prev = prevSelectionCountRef.current
    prevSelectionCountRef.current = selectionCount
    if (prev > 0 && selectionCount === 0 && infoPanelOpen) {
      handleInfoPanelClose()
    }
  }, [selectionCount, infoPanelOpen, handleInfoPanelClose])

  /** Below laptop, expanded search row and category panel share one strip — only one open at a time. */
  const toggleMobileHeaderSearch = useCallback(() => {
    setMobileSearchOverlayOpen((open) => {
      const next = !open
      if (next) setHeaderCategoryOpen(false)
      return next
    })
  }, [])

  const toggleHeaderCategory = useCallback(() => {
    setHeaderCategoryOpen((open) => {
      const next = !open
      if (next) setMobileSearchOverlayOpen(false)
      return next
    })
  }, [])

  useEffect(() => {
    if (!headerCategoryOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setHeaderCategoryOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [headerCategoryOpen])

  const versionChip = (
    <Chip variant="accent" aria-label="Version 1.1.3">
      v1.1.3
    </Chip>
  )

  const logoImg = (
    <img
      src={logoSymbol}
      alt="Some Icons"
      width={28}
      height={28}
      className="ds-sidebar__logoIcon"
    />
  )

  const filterStackProps = {
    searchQuery,
    onSearchChange: setSearchQuery,
    iconStyle,
    onIconStyleChange: setIconStyle,
  }

  const copyrightNode = <>© {new Date().getFullYear()} Some UI</>

  return (
    <div
      className={cn(
        'homepage-shell',
        headerCategoryOpen && 'homepage-shell--categoryNavOpen',
      )}
    >
      <div className="homepage-laptop-only">
        <Sidebar
          pageName="Icon library"
          chipSlot={versionChip}
          logo={logoImg}
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
          <HomePageFilterStack {...filterStackProps} showSearch />
        </Sidebar>
      </div>

      <div ref={navChromeRef} className="homepage-navChrome app-hide-from-laptop">
        <SiteHeader
          logo={logoImg}
          title="Icon library"
          chipSlot={versionChip}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search icons..."
          searchAriaLabel="Search icons"
          mobileSearchOpen={mobileSearchOverlayOpen}
          settingsRowOpen={false}
          rightSlot={({ mobileSearchPanelId }) => (
            <>
              <div className="ds-siteHeader__tabletSearch ds-siteHeader-tabletOnly">
                <InputField
                  showLabel={false}
                  className="ds-siteHeader__searchField"
                  contentSlot={
                    <Input
                      type="text"
                      placeholder="Search icons..."
                      autoComplete="off"
                      aria-label="Search icons"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      leadingSlot={
                        <SomeIcon
                          iconName="search"
                          iconStyle="outline"
                          iconSize="md"
                          padding="2"
                        />
                      }
                      trailingSlot={
                        searchQuery.length > 0 ? (
                          <button
                            type="button"
                            className="ds-input__trailingAction"
                            aria-label="Clear search"
                            onMouseDown={(e) => {
                              e.preventDefault()
                            }}
                            onClick={() => {
                              setSearchQuery('')
                            }}
                          >
                            <SomeIcon
                              iconName="multiply"
                              iconStyle="outline"
                              iconSize="sm"
                              padding="050"
                              color="var(--color-main-quaternary)"
                            />
                          </button>
                        ) : undefined
                      }
                    />
                  }
                />
              </div>
              <div className="ds-siteHeader__actions">
                <div className="ds-buttonGroup ds-siteHeader-mobileOnly">
                  <Button
                    type="button"
                    variant="transparent"
                    size="md"
                    radius="lg"
                    aria-label="Search icons"
                    aria-expanded={mobileSearchOverlayOpen}
                    aria-controls={mobileSearchPanelId}
                    onClick={toggleMobileHeaderSearch}
                    leadingSlot={
                      <SomeIcon
                        iconName="search"
                        iconStyle="outline"
                        iconSize="md"
                        padding="050"
                      />
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="transparent"
                  size="md"
                  radius="lg"
                  aria-label="Categories"
                  aria-expanded={headerCategoryOpen}
                  aria-controls={categoryPanelId}
                  onClick={toggleHeaderCategory}
                  leadingSlot={
                    <SomeIcon
                      iconName="menu-hamburger"
                      iconStyle="outline"
                      iconSize="md"
                      padding="050"
                    />
                  }
                />
              </div>
            </>
          )}
        />

        <div
          id={categoryPanelId}
          className={cn(
            'homepage-navCategoryPanel',
            headerCategoryOpen && 'homepage-navCategoryPanel--open',
          )}
          role="dialog"
          aria-label="Categories"
          aria-hidden={headerCategoryOpen ? undefined : true}
          {...(!headerCategoryOpen ? { inert: true } : {})}
        >
          <InputSection
            showLabel={false}
            contentScrollable
            className="homepage-navCategoryPanelSection"
            contentSlot={
              <HomeCategoryList listClassName="homepage-categoryList homepage-categoryList--nav" />
            }
          />
        </div>
      </div>

      {categoryNavBackdrop.mounted ? (
        <button
          type="button"
          className={cn(
            'app-backdrop homepage-navCategoryBackdrop',
            categoryNavBackdrop.visible && 'app-backdrop--visible',
          )}
          aria-label="Dismiss categories"
          onClick={() => setHeaderCategoryOpen(false)}
        />
      ) : null}

      <main className="homepage-main">
        <div className="homepage-mainRow">
          <div className="homepage-pageContentWrap">
            <PageContent>
              <IconGrid
                gradientOverlayInsetPx={
                  selectionCount > 0 ? GRADIENT_OVERLAY_HOME_HEIGHT_PX : 0
                }
                onInfoOpen={handleInfoOpen}
                onInfoPanelClose={handleInfoPanelClose}
                infoPanelOpen={infoPanelOpen}
                infoPanelTargetId={infoPanelIcon?.id ?? null}
              />
              <SiteFooter
                className="ds-siteFooter--inScroll homepage-mobile-only"
                copyright={copyrightNode}
              />
            </PageContent>
            <GradientOverlay
              visible={selectionCount > 0}
              fullWidth
              className="homepage-bulkOverlay"
              style={{ height: GRADIENT_OVERLAY_HOME_HEIGHT_PX }}
              progressiveBlur
              progressiveBlurIntensity={80}
              progressiveBlurPosition="bottom"
              backdropBlur={false}
            >
              {selectionCount > 0 ? (
                <div ref={bulkBarsWrapRef} className="homepage-bulkBarsWrap">
                  <BulkActionBar selectedCount={selectionCount}>
                    <>
                      <BulkActionHoverChip
                        chipLabel={allVisibleSelected ? 'Deselect all' : 'Select all'}
                      >
                        <Button
                          type="button"
                          variant="transparent"
                          size="md"
                          radius="md"
                          disabled={visibleGridIcons.length === 0}
                          aria-label={allVisibleSelected ? 'Deselect all' : 'Select all'}
                          aria-pressed={allVisibleSelected}
                          onClick={handleToggleSelectAllVisible}
                          leadingSlot={
                            <SomeIcon
                              iconName="check-multiple"
                              iconStyle="outline"
                              iconSize="md"
                              padding="0"
                            />
                          }
                        />
                      </BulkActionHoverChip>
                      <BulkActionHoverChip chipLabel="Deselect">
                        <Button
                          type="button"
                          variant="transparent"
                          size="md"
                          radius="md"
                          aria-label="Deselect all"
                          onClick={() => clearSelection()}
                          leadingSlot={
                            <SomeIcon
                              iconName="multiply"
                              iconStyle="outline"
                              iconSize="md"
                              padding="0"
                            />
                          }
                        />
                      </BulkActionHoverChip>
                    </>
                  </BulkActionBar>
                </div>
              ) : null}
            </GradientOverlay>
          </div>

          <InfoPanel
            open={infoPanelOpen}
            header={
              infoPanelOpen ? (
                <IconInfoPanelHeader onClose={handleInfoPanelClose} />
              ) : undefined
            }
            aria-label={
              infoPanelIcon ? `${infoPanelIcon.id} details` : 'Icon details'
            }
          >
            {infoPanelIcon ? <IconInfoPanelContent icon={infoPanelIcon} /> : null}
          </InfoPanel>
        </div>
      </main>

      <SiteFooter
        className="ds-siteFooter--fixed homepage-tablet-only"
        copyright={copyrightNode}
      />
    </div>
  )
}
