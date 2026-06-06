declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function trackEvent(eventName: string, params?: object): void {
  if (params) {
    window.gtag?.('event', eventName, params)
    return
  }
  window.gtag?.('event', eventName)
}

interface DownloadEventParams {
  format: 'svg'
  style: string
  size: number
  count: number
  is_zip: boolean
}

export type SnippetSection = 'react_import' | 'react_usage' | 'svg'

interface SnippetCopyEventParams {
  section: SnippetSection
  style: string
  size: number
  count: number
}

export type InstallCopySection = 'install' | 'import'

interface InstallModalCopyEventParams {
  section: InstallCopySection
  package_manager?: string
  import_mode?: string
}

export type ExternalLinkDestination = 'figma' | 'github'
export type ExternalLinkLocation = 'footer' | 'sidebar' | 'changelog'

interface ExternalLinkEventParams {
  destination: ExternalLinkDestination
  location: ExternalLinkLocation
}

export function trackDownload(params: DownloadEventParams): void {
  trackEvent('icon_download', params)
}

export function trackSnippetCopy(params: SnippetCopyEventParams): void {
  trackEvent('icon_copy', params)
}

export function trackInstallModalCopy(params: InstallModalCopyEventParams): void {
  trackEvent('install_modal_copy', params)
}

export function trackExternalLink(params: ExternalLinkEventParams): void {
  trackEvent('external_link_click', params)
}
