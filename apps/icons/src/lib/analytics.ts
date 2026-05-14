declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface DownloadEventParams {
  format: 'svg' | 'png'
  style: string
  size: number
  count: number
  is_zip: boolean
}

interface CopyEventParams {
  format: 'svg' | 'react'
  style: string
  size: number
  count: number
}

type EventParams = DownloadEventParams | CopyEventParams

function trackEvent(eventName: string, params: EventParams): void {
  window.gtag?.('event', eventName, params)
}

export function trackDownload(params: DownloadEventParams): void {
  trackEvent('icon_download', params)
}

export function trackCopy(params: CopyEventParams): void {
  trackEvent('icon_copy', params)
}
